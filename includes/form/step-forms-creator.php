<?php
//
// Add the Settings Page to the BuddyForms Menu
//
function buddyforms_step_forms_screen_menu() {
	add_submenu_page( 'edit.php?post_type=buddyforms', __( 'Step Forms', 'buddyforms-step-forms' ), __( 'Step Forms', 'buddyforms-step-forms' ), 'manage_options', 'buddyforms_step_forms_screen', 'buddyforms_step_forms_screen_content' );
}

add_action( 'admin_menu', 'buddyforms_step_forms_screen_menu', 9999 );

function buddyforms_step_forms_screen_content() {
	global $buddyforms;
	?>
    <div id="bf_admin_wrap" class="wrap">

        <div class="wrap about-wrap buddyforms-step_forms">

            <h1><?php _e( 'Step Forms Creator', 'buddyforms-step-forms' ) ?></h1>

            <p class="about-text"><?php _e( 'Select the Form', 'buddyforms' ) ?></p>


			<?php

			global $buddyforms;
			if ( is_array( $buddyforms ) ) {

				foreach ( $buddyforms as $slug => $buddyform ) {

				}

			}

			?>

        </div>


        <div id="buddyforms-step-forms-tabs">

            <ul style="display: none">
				<?php
				if ( is_array( $buddyforms ) ) {

					foreach ( $buddyforms as $slug => $buddyform ) {
						echo '<li><a href="#tab' . $slug . '" >' . $buddyform['name'] . '</a></li>';
					}

				}
				?>
            </ul>


            <select id="step-forms-form-select">

				<?php


				if ( is_array( $buddyforms ) ) {

					foreach ( $buddyforms as $slug => $buddyform ) {
						echo '<option value="' . $slug . '"><a href="#tab' . $slug . '" >' . $buddyform['name'] . '</a></option>';

						foreach ( $buddyform['form_fields'] as $key => $form_field ) {
							//echo '<li> -> ' . $form_field['name'] . '</li>';
						}
					}

				}

				?>
            </select>


			<?php
			if ( is_array( $buddyforms ) ) {

				foreach ( $buddyforms as $slug => $buddyform ) {

					echo '<div id="tab' . $slug . '">' . $slug;
					echo '<div id="step-' . $slug . '"></div>';


					echo '<div><a href="#" data-slug="' . $slug . '" class="buddyforms-step-forms-create-step">Add New Step</a></div>';

					echo '<div><a href="#" data-slug="' . $slug . '" class="buddyforms-step-forms-save">Save Steps</a></div>';


					echo '</div>';
					?>
                    <script>
                        jQuery(document).ready(function (jQuery) {
                            buddyforms_get_step("<?php echo $slug ?>");
                        });
                    </script>
					<?php
				}

			}
			?>

        </div>

        <div id="step-form-node-options">Da is was</div>
    </div>
	<?php
}
