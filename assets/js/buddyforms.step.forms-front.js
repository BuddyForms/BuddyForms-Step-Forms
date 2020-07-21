jQuery(document).ready(function() {
    if (BuddyFormsHooks && buddyformsGlobal) {
        
        //
        // Event:
        // After submit error
        //
        BuddyFormsHooks.addAction('buddyforms:error:trigger', function (args) {
            const [ form_slug, errors ] = args;
            const $step_form = jQuery(`#buddyforms-front-step-form-${form_slug}`);

            if (!$step_form.length) {
                return;
            }
        
            const form_errors =  Object.keys(errors.errors['buddyforms_form_' + form_slug]);

            if (!form_errors.length) {
                return;
            }

            // Go to the step of the first error.
            const step = $step_form.find(`#${form_errors[0]}`).closest('.tab-pane');
            $step_form.smartWizard("goToStep", step.data('step-index'));
        });

    }
});


function buddyforms_sf_init_step_form(form_slug) {
    const $step_form = jQuery(`#buddyforms-front-step-form-${form_slug}`);

    //
    // Step form init
    //
    $step_form.smartWizard({ autoAdjustHeight: false });
    $step_form.find('.buddyforms-sf-step').each(function(index) {
        jQuery(this).data('step-index', index);
    });

    //
    // Per validaiton step
    //
    $step_form.on("leaveStep", function(e, $anchorObject, currentStepIndex, nextStepIndex, stepDirection) {
        
        const step = jQuery($anchorObject.attr('href'));
        const form_fields = step.find(':input');
        let is_valid = true;

        if (stepDirection !== 'forward') {
            return is_valid;
        }

        form_fields.each(function(i) {
            const elem = jQuery(this);
            if (!elem.valid()) {
                is_valid = is_valid && false;
            }
        });

        // If there is a password strength
        // requirement on this step.
        const pass_strength = step.find('#password-strength');
        if (pass_strength.length > 0 
            && (pass_strength.hasClass('bad') || pass_strength.hasClass('short'))
        ) {
            is_valid = is_valid && false;
        }

        return is_valid;
    });
}