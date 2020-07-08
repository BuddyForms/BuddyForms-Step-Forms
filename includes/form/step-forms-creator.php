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
	<div id="bf_admin_wrap" class="buddyforms-sf">

		<div class="buddyforms-sf-row">
			<h1 class="buddyforms-sf-my-3">
				<?php _e( 'Step Forms Creator', 'buddyforms-step-forms' ) ?>
			</h1>
		</div>

		<div class="buddyforms-sf-row">
			<div class="buddyforms-sf-col-left">
				<div class="buddyforms-sf-steps">
					<header class="buddyforms-sf-box">
						<h2>
							<?php _e( 'Select Form', 'buddyforms-step-forms' ) ?>
						</h2>
						
						<select id="step-forms-form-select" class="buddyforms-sf-select-form">
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

						<a href="#">
							<?php _e( 'Do you need help? You can find documentation here.', 'buddyforms-step-forms' ) ?>
							<span class="dashicons dashicons-book buddyforms-sf-flip"></span>
						</a>
					</header>
					<section>
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
							<?php
							if ( is_array( $buddyforms ) ) {
								foreach ( $buddyforms as $slug => $buddyform ) {
									echo '<div id="tab' . $slug . '">';
									echo '<div id="step-' . $slug . '"></div>';
									echo '<div><a href="#" data-slug="' . $slug . '" class="buddyforms-sf-create-step">'. __('Add New Step') . '</a></div>';
									echo '<div><a href="#" data-slug="' . $slug . '" class="buddyforms-sf-save">' . __('Save Steps') . '</a></div>';
									echo '</div>';
									?>
									<script>
										jQuery(document).ready(function(jQuery) {
											buddyforms_get_step("<?php echo $slug ?>");
										});
									</script>
									<?php
								}
							}
							?>
						</div>

					</section>
				</div>
			</div>
			<div class="buddyforms-sf-col-right">
				<div class="buddyforms-sf-sidebar buddyforms-sf-box">
					<header>
						<h2>
							<?php _e( 'Hooks and Integrations', 'buddyforms-step-forms' ) ?>
						</h2>
					</header>
					<div id="step-form-node-options">Da is was</div>
				</div>
			</div>
		</div>
	</div>
<?php
}