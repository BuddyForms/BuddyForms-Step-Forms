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

	$output = '';
	$step_form = $steps_forms[ $form_slug ];
	
	$output .= '<div class="">';
	$output .= '<div id="buddyforms-front-step-form-'. $form_slug . '">';
	
	$output .='<ul class="nav">';
	foreach ( $step_form['steps'] as $step ) {
		$output .= '<li>';
		$output .= '<a class="nav-link" href="#step-'. $step['id'] . '">';
		$output .= $step['name'];
		$output .= '</a>';
		$output .= '</li>';
	}

	$output .='</ul>';
	$output .= '<div class="tab-content">';

	foreach ( $step_form['steps'] as $step ) {
		
		$output .= '<div id="step-'. $step['id'] . '" class="tab-pane" role="tabpanel">';

		$fields = $step['children'];

		foreach ( $fields as $field ) {
			$output .= '<p>Field Name: '. $field['name'] . '</p>';
		}

		$output .= '</div>';
	}

	$output .= '</div>';
	$output .= '</div>';

	$output .= '<script>jQuery(document).ready(function(jQuery) { buddyforms_sf_init_step_form("' . $form_slug . '"); }); </script>';

	return $output;
}