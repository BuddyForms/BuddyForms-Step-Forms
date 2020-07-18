<?php

add_shortcode( 'buddyforms_step_form', 'buddyforms_step_form_shortcode' );
function buddyforms_step_form_shortcode( $attr ) {
	$attr = shortcode_atts( array(
		'form_slug' => false,
	), $attr );

	if ( !$attr['form_slug'] ) {
		return '';
	}

	$form_slug = $attr['form_slug'];
	$steps_forms = get_option('buddyforms_step_forms');

	if ( !isset( $steps_forms[ $form_slug ] ) ) {
		return '';
	}

	$_GET['buddyforms-step-form-front'] = true;

	$output = do_shortcode('[bf form_slug="' . $form_slug . '"]');
	$output .= '<script>jQuery(document).ready(function(jQuery) { buddyforms_sf_init_step_form("' . $form_slug . '"); }); </script>';

	unset($_GET['buddyforms-step-form-front']);

	return $output;
}