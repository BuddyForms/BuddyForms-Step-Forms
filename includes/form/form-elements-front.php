<?php

add_filter( 'buddyforms_fields_inner_loop_start', 'buddyforms_step_forms_fields_inner_loop_end', 10, 3 );
function buddyforms_step_forms_fields_inner_loop_end( $form, $customfield, $form_slug ) {
	global $buddyforms;

	$step_forms = get_option( 'buddyforms_step_forms' );


	$form->addElement( new Element_HTML( '<p>the needed structure</p>' ) );

	return $form;

}