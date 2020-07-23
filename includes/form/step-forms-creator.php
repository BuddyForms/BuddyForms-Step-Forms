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
			<h1 class="buddyforms-sf-my-2">
				<?php _e( 'Step Forms Creator', 'buddyforms-step-forms' ) ?>
			</h1>
		</div>

		<div class="buddyforms-sf-row">
			<header class="buddyforms-sf-header buddyforms-sf-box">
				<h2>
					<?php _e( 'Select Form', 'buddyforms-step-forms' ) ?>
				</h2>
				
				<select id="step-forms-form-select" class="buddyforms-sf-select-form">
					<?php
					if ( is_array( $buddyforms ) ) {
						foreach ( $buddyforms as $slug => $buddyform ) {
							echo '<option value="' . $slug . '"><a href="#tab-' . $slug . '" >' . $buddyform['name'] . '</a></option>';
						}
					}
					?>
				</select>
	
				<a href="#" target="_blank">
					<?php _e( 'Do you need help? You can find documentation here.', 'buddyforms-step-forms' ) ?>
					<span class="iconify buddyforms-sf-flip" data-icon="dashicons:book" data-inline="false"></span>
				</a>
			</header>
		</div>

		<div class="buddyforms-sf-row">

			<div id="buddyforms-step-forms-tabs">

				<?php if ( is_array($buddyforms) ) : ?>

					<ul id="buddyforms-step-forms-tabs-list" style="display: none">
						<?php 
						if ( is_array( $buddyforms ) ) :
							foreach ( $buddyforms as $slug => $buddyform ) : ?>
								<li data-slug="<?php echo $slug; ?>">
									<a href="#tab-<?php echo $slug; ?>"><?php echo $buddyform['name'] ?></a>
								</li>
							<?php
							endforeach;
						endif;
						?>
					</ul>
					

					<?php 
					
					$buddyforms_step_forms = get_option('buddyforms_step_forms');

					foreach ( $buddyforms as $slug => $buddyform ) : ?>

						<div id="tab-<?php echo $slug; ?>" class="buddyforms-st-tab buddyforms-st-on-viewport">
						
							<div class="buddyforms-sf-col-left">
								<div class="buddyforms-sf-steps">
									<div data-slug="<?php echo $slug; ?>" id="step-<?php echo $slug ?>"></div>

									<script>
										jQuery(document).ready(function(jQuery) {
											buddyforms_sf_get_step("<?php echo $slug ?>");
										});
									</script>
								</div>
							</div>
							<div class="buddyforms-sf-col-right">
								<div class="buddyforms-sf-sidebar buddyforms-sf-box">
									<div class="buddyforms-sf-sidebar-tabs">

										<ul>
											<li>
												<a href="#tab-global-<?php echo $slug; ?>">
													<?php _e( 'Step Form', 'buddyforms-step-forms' ) ?>
												</a>
											</li>
											<li>
												<a href="#tab-block-<?php echo $slug; ?>">
													<?php _e( 'Block', 'buddyforms-step-forms' ) ?>
												</a>
											</li>
										</ul>

										<div id="tab-global-<?php echo $slug; ?>" class="buddyfoms-sf-global-sidebar">
											<h2>Form name: <?php echo $slug; ?></h2>
	
											<?php
	
											$shortcode = '';
	
											if ( isset( $buddyforms_step_forms[ $slug ] ) 
												&& $step_form = $buddyforms_step_forms[ $slug ]
											) {
												$shortcode = $step_form['shortcode'];
											}
											?>
	
											<p class="buddyforms-sf"></p>
	
											<p class="buddyfoms-sf-shortcode">
												<?php 
													if ( !empty( $shortcode ) ) {
														echo '<strong>Shortcode:</strong> ' . $shortcode;
													}
												?> 
											</p>
										</div>
										<div id="tab-block-<?php echo $slug; ?>" class="buddyfoms-sf-block-sidebar">
											<p class="buddyfoms-sf-no-block-selected">
												No block selected.
											</p>
										</div>
									</div>
									<div class="buddyfoms-sf-global-sidebar-actions">
										<button 
											data-slug="<?php echo $slug; ?>" 
											class="button button-primary buddyforms-sf-save"
										>
											<?php _e( 'Save Step Form', 'buddyforms-step-forms' ) ?>
										</button>
									</div>
								</div>
							</div>

						</div>

					<?php endforeach; ?>

				<?php endif; ?>
			</div>
		</div>
	</div>
<?php
}