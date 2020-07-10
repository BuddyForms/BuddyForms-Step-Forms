const KEY_ENTER = 13;


jQuery(document).ready(function (jQuery) {

    //
    // Create the tabs
    //
    jQuery("#buddyforms-step-forms-tabs").tabs();


    //
    // Switch the Tabs with a select
    //
    jQuery(document.body).on('change', '#step-forms-form-select', function () {
        form_slug = jQuery("#step-forms-form-select").val();
        jQuery('#buddyforms-step-forms-tabs a[href="#tab' + form_slug + '"]')[0].click()
    });

    //
    // Save the step form
    //
    jQuery(document.body).on('click', '.buddyforms-sf-save', function () {

        $form_slug = jQuery(this).attr('data-slug');


        var tree_data = jQuery('#step-' + $form_slug).tree('getTree');

        json = jQuery('#step-' + $form_slug).tree('toJson');


        // var node1 = jQuery('#step-' + $form_slug).tree('getNodeByName', 'contact');

        console.log(json);


        /*  jQuery('#step-' + $form_slug).tree(
              'addParentNode',
              {
                  name: 'new_parent',
                  id: 456
              },
              node1
          );*/


        jQuery.ajax({

            url: buddyformsGlobal.admin_url,
            type: 'POST',
            dataType: 'json',
            dragAndDrop: true,
            tabIndex: 1,
            data: {
                "action": "buddyforms_step_forms_save_step",
                "form_slug": $form_slug,
                "json": json
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
            success: function (response) {
                console.log(response);

                alert('Steps Saved')
            }

        });
    });

});


//
// get the step form json
//
function buddyforms_get_step($form_slug) {

    jQuery.ajax({

        url: buddyformsGlobal.admin_url,
        type: 'POST',
        dataType: 'json',
        data: {
            "action": "buddyforms_step_forms_get_steps",
            "form_slug": $form_slug
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
        success: function (response) {
            console.log(response);

            const $tree = jQuery('#step-' + $form_slug).tree({
                dragAndDrop: true,
                autoOpen: true,
                //tabIndex: 1,
                data: response,
                selectable: true,
                onCanSelectNode: function (node) {
                    if (node.children.length == 0) {
                        // Nodes without children can be selected
                        return true;
                    } else {
                        // Nodes with children cannot be selected
                        return false;
                    }
                },
                onCanMove: function (node) {

                    console.log(node.parent.parent);

                    if (!node.parent.parent) {
                        // Example: Cannot move root node)
                        return false;
                    } else {
                        return true;
                    }
                },
                onCanMoveTo: function (moved_node, target_node, position) {

                    if (!target_node.parent.name && position !== 'inside') {
                        return false;
                    }
                    
                    if (target_node.parent.name && position === 'inside') {
                        return false;
                    }

                    return true;
                },
                onCreateLi: function (node, $li) {
                    if (!node.parent.name) {
                        buddyforms_init_step_node(node, $li);
                    } else {
                        $li.find('.jqtree-element')
                           .addClass('buddyforms-sf-field')
                           .addClass('buddyforms-sf-box-small')
                        ;
                    }
                }
            });

            $tree.on('click', '.buddyforms-sf-add-step-after', function(e){

                e.stopPropagation();

                const node_id = jQuery(e.currentTarget).data('node-id');
                buddyforms_create_step($tree, node_id, 'after');
            });

            $tree.on('click', '.buddyforms-sf-add-step-before', function(e){

                e.stopPropagation();

                const node_id = jQuery(e.currentTarget).data('node-id');
                buddyforms_create_step($tree, node_id, 'before');

            });

            $tree.on('click', '.buddyforms-sf-delete-step', function(e) {

                e.stopPropagation();

                const node_id = jQuery(e.currentTarget).data('node-id');
                buddyforms_delete_step($tree, node_id);
            });

            // Handle a click on the edit link
            $tree.on('click', '.buddyforms-sf-edit-step', function (e) {
                // Get the id from the 'node-id' data property
                const node_id = jQuery(e.currentTarget).data('node-id');

                // Get the node from the tree
                const node = $tree.tree('getNodeById', node_id);

                const updateNode = function(node) {
                    const name = jQuery(`input[name="node_name_${node.id}"]`).val();
                    $tree.tree('updateNode', node, name);
                }

                if (node) {
                    // Display the node name

                    jQuery(`<form><input value="${node.name}" type="text" style="z-index:10000" name="node_name_${node.id}"><br></form>`).dialog({
                        modal: true,
                        buttons: {
                            'OK': function () {
                                updateNode(node);
                                jQuery(this).dialog('close').dialog('destroy');
                            },
                            'Cancel': function () {
                                jQuery(this).dialog('close').dialog('destroy');
                            }
                        }
                    });

                    //
                    // Avoid keypress redirections 
                    //
                    jQuery(`input[name="node_name_${node.id}"]`).keypress(function(e) {
                        if (KEY_ENTER === e.keyCode) {
                            e.preventDefault();
                            updateNode(node);
                            jQuery(this).parents('.ui-dialog-content').dialog('close').dialog('destroy');
                        }
                    });
                }
            });

            $tree.on('click', '.buddyforms-sf-step-header', function(e) {
                const node_id = jQuery(e.currentTarget).data('node-id');
                buddyforms_toggle_step($tree, node_id);
            });


            $tree.on(
                'tree.move',
                function (event) {
                    event.preventDefault();
                    //console.log(event);

                    if (typeof event.move_info.target_node.parent === 'object') {
                    } else {

                    }
                    event.move_info.do_move();
                }
            );


            //
            // Display tab options on select
            //
            $tree.on(
                'tree.select',
                function (event) {
                    if (event.node) {
                        // node was selected
                        var node = event.node;


                        jQuery('#step-form-node-options').html(node.name);
                    } else {
                        // event.node is null
                        // a node was deselected
                        // e.previous_node contains the deselected node
                    }
                }
            );

        }

    });
}


/**
 * @param {object} tree 
 * @param {int|string} node_id
 * @param {string} direction [after, before]
 */
function buddyforms_create_step($tree, node_id, direction) {

    direction = direction || 'after';

    const tree_obj = $tree.tree('getTree');
    const node = $tree.tree('getNodeById', node_id);
    const new_node_id = tree_obj.children.length + 1;

    const new_node = $tree.tree(
        direction === 'after' ? 'addNodeAfter' : 'addNodeBefore',
        {
            name: `Step`,
            id: new_node_id,
            children: []
        },
        node
    );

    buddyforms_init_step_node(new_node);
}

/**
 * @param {object} tree 
 * @param {int|string} node_id
 */
function buddyforms_delete_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    $tree.tree('removeNode', node);
}

function buddyforms_toggle_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    $tree.tree( 
        !node.is_open ? 'openNode' : 'closeNode', 
        node
    );
}

function buddyforms_init_step_node(node, $el) {

    $el = $el || jQuery(node.element);

    if (!$el) {
        return;
    }

    if (node.parent.name) {
        return;
    }

    $el.addClass('buddyforms-sf-step')
        .children('.jqtree-element')
        .html(`
            <header class="buddyforms-sf-step-header buddyforms-sf-box-small" data-node-id="${node.id}">
                <p>
                    ${node.name}
                    <a href="#node-${node.id}" class="buddyforms-sf-edit-step buddyforms-sf-btn" data-node-id="${node.id}">
                        <span class="iconify" data-icon="dashicons:edit" data-inline="false"></span>
                    </a>
                </p>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-add-step-before buddyforms-sf-btn">
                    Add Before
                    <span class="iconify" data-icon="dashicons-insert-before" data-inline="false"></span>
                </a>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-add-step-after buddyforms-sf-btn">
                    Add After
                    <span class="iconify" data-icon="dashicons-insert-after" data-inline="false"></span>
                </a>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-delete-step buddyforms-sf-btn">
                    Delete
                    <span class="iconify" data-icon="dashicons:trash" data-inline="false"></span>
                </a>
            </header>
        `)
    ;
}