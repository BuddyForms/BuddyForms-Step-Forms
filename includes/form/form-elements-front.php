<?php

add_filter( 'buddyforms_custom_HTML_before_render_element_loop', 'buddyforms_step_forms_custom_HTML_before_render_element_loop', 10, 2 );
function buddyforms_step_forms_custom_HTML_before_render_element_loop( $form_slug, $form ) {
	$output = '';

	if (!$_GET['buddyforms-step-form-front']) {
		return $output;
	}
	
	$steps_forms = get_option( 'buddyforms_step_forms' );
	
	if ( !isset( $steps_forms[ $form_slug ] ) ) {
		return $output;
	}

	$step_form = $steps_forms[ $form_slug ];
	$steps = $step_form['steps'];
	
	if ( !is_array( $steps ) || empty( $steps ) ) {
		return $output;
	}
	
	$firstStep = $steps[0];

	$output .= '<div id="buddyforms-front-step-form-'. $form_slug . '">';
	$output .= '<ul class="nav">';

	foreach( $steps as $step ) {
		$output .= '<li>';
		$output .= '<a class="nav-link" href="#step-'. $step['id'] . '">' . $step['name'] .  '</a>';
		$output .= '</li>';		
	}

	$output .= '</ul>';
	$output .= '<div class="tab-content">';
	$output .= '<div id="step-'. $firstStep['id'] . '" class="tab-pane buddyforms-sf-step buddyforms-sf-clearfix" role="tabpanel">';

	return $output;
}


add_filter( 'buddyforms_before_render_element_loop', 'buddyforms_step_forms_before_render_element_loop', 10, 2 );
function buddyforms_step_forms_before_render_element_loop( $elements, $form_slug ) {

	if (!$_GET['buddyforms-step-form-front']) {
		return $elements;
	}

	$steps_forms = get_option( 'buddyforms_step_forms' );
	
	if ( !isset( $steps_forms[ $form_slug ] ) ) {
		return $elements;
	}

	$step_form = $steps_forms[ $form_slug ];
	$steps = $step_form['steps'];

	if ( !is_array( $steps ) || empty( $steps ) ) {
		return $elements;
	}

	$start_pos = false;
	$_elements = array();
	$element_size = sizeof( $elements );

	for ($i = 0; $i < $element_size; $i++) { 
		$elm = $elements[$i];
		$field_id = $elm->getAttribute( 'field_id' );

		if (empty($field_id)) {
			continue;
		}

		for ($ii = 0; $ii < sizeof($steps); $ii++ ) {
			$step = $steps[$ii];
			$fields = $step['children'];

			if (!is_array($fields) || empty($fields)) {
				continue;
			}

			// $field_id is in this step?
			$elm_pos = array_search($field_id, array_column($fields, 'id'));
			if ($elm_pos !== false) {
				$start_pos = ($start_pos === false) ? $i : $start_pos;
				$_elements[$ii][$elm_pos] = $elm;
				unset($elements[$i]);
			}
		}
	}

	krsort($_elements);

	foreach ($_elements as $fields) {
		ksort($fields);
		$elements = array_merge(
			array_slice($elements, 0, $start_pos, true),
			$fields,
			array_slice($elements, $start_pos, count($elements) , true)
		);
	}

	return $elements;
}

add_filter( 'buddyforms_custom_HTML_before_render_element', 'buddyforms_step_forms_custom_HTML_before_render_element', 10, 4 );
function buddyforms_step_forms_custom_HTML_before_render_element( $element, $form_slug, $elementCount, $elementSize ) {
	$output = '';
	
	if (!$_GET['buddyforms-step-form-front']) {
		return $output;
	}
	
	$steps_forms = get_option( 'buddyforms_step_forms' );
	
	if ( !isset( $steps_forms[ $form_slug ] ) ) {
		return $output;
	}

	$step_form = $steps_forms[ $form_slug ];
	$steps = $step_form['steps'];

	if ( !is_array( $steps ) || empty( $steps ) ) {
		return $output;
	}

	$firstStep = $steps[0];
	$element_id = $element->getAttribute( 'field_id' );

	if (empty($element_id)) {
		return $output;
	}

	foreach ( $steps as $step ) {
		$fields = $step['children'];

		// Always skip first step.
		if ($step['id'] === $firstStep['id']) {
			continue;
		}

		if ( !is_array( $fields ) || empty( $fields ) ) {
			continue;
		}

		$firstStepField = $fields[0];

		if (isset($firstStepField['id']) && $firstStepField['id'] === $element_id) {
			$output .= '<div id="step-'. $step['id'] . '" class="tab-pane buddyforms-sf-step buddyforms-sf-clearfix" role="tabpanel">';
		}

	}

	return $output;

}

add_filter( 'buddyforms_custom_HTML_after_render_element', 'buddyforms_step_forms_custom_HTML_after_render_element', 10, 4 );
function buddyforms_step_forms_custom_HTML_after_render_element( $element, $form_slug, $elementCount, $elementSize ) {
	$output = '';

	if (!$_GET['buddyforms-step-form-front']) {
		return $output;
	}
	
	$steps_forms = get_option( 'buddyforms_step_forms' );
	
	if ( !isset( $steps_forms[ $form_slug ] ) ) {
		return $output;
	}


	$element_id = $element->getAttribute( 'field_id' );

	if (empty($element_id)) {
		return $output;
	}

	$step_form = $steps_forms[ $form_slug ];
	$steps = $step_form['steps'];

	if ( !is_array( $steps ) || empty( $steps ) ) {
		return $output;
	}

	$lastStep = $steps[ count( $steps ) - 1 ];

	foreach ( $steps as $step ) {
		$fields = $step['children'];

		if ( $step['id'] === $lastStep['id'] ) {
			continue;
		}

		if ( !is_array( $steps ) || empty( $steps ) ) {
			return $output;
		}

		$lastStepField = $fields[ count( $fields ) - 1 ];

		if (isset($lastStepField['id']) && $lastStepField['id'] === $element_id) {
			$output .= '</div>';
		}
	}

	// Last element?
	if ( $elementCount === $elementSize ) {
		$output .= '</div></div></div>';
	}

	return $output;
}