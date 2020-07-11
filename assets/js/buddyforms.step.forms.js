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
        json = jQuery('#step-' + $form_slug).tree('toJson');

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
            console.error(error);
        },
        success: function (response) {
            const $tree = jQuery('#step-' + $form_slug).tree({
                dragAndDrop: true,
                autoOpen: true,
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
                onCanMoveTo: function (moved_node, target_node, position) {

                    const moved_node_is = !moved_node.parent.parent ? 'parent' : 'child';
                    const target_node_is = !target_node.parent.parent ? 'parent' : 'child';

                    // Child node can't be moved after or before a parent node.
                    if (target_node_is === 'parent' && moved_node_is === 'child' && position !== 'inside') {
                        return false;
                    }
                    
                    // Any node can't be place inside a child node.
                    if (target_node_is === 'child' && position === 'inside') {
                        return false;
                    }

                    // Parent node can't be moved after or before a child node.
                    if (target_node_is === 'child' && moved_node_is === 'parent') {
                        return false;
                    }

                    // Parent node can't be place inside to another parent node.
                    if (target_node_is === 'parent' && moved_node_is === 'parent' && position === 'inside') {
                        return false;
                    }

                    return true;
                },
                onCreateLi: function (node, $li) {
                    if (!node.parent.name) {
                        buddyforms_init_step_node(node, $li);
                    } else {
                        buddyforms_init_field_node(node, $li);
                    }
                }
            });

            $tree.on('click', '.buddyforms-sf-add-step-after', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_create_step($tree, node_id, 'after');
            });

            $tree.on('click', '.buddyforms-sf-add-step-before', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_create_step($tree, node_id, 'before');

            });

            // $tree.on('click', '.buddyforms-sf-delete-step', function(event) {

            //     event.stopPropagation();

            //     const node_id = jQuery(event.currentTarget).data('node-id');
            //     buddyforms_delete_step($tree, node_id);
            // });

            // Handle a click on the edit link
            // $tree.on('click', '.buddyforms-sf-edit-step', function (event) {
            //     // Get the id from the 'node-id' data property
            //     const node_id = jQuery(event.currentTarget).data('node-id');

            //     // Get the node from the tree
            //     const node = $tree.tree('getNodeById', node_id);

            //     const updateNode = function(node) {
            //         const name = jQuery(`input[name="node_name_${node.id}"]`).val();
            //         $tree.tree('updateNode', node, name);
            //     }

            //     if (node) {
            //         // Display the node name

            //         jQuery(`<form><input value="${node.name}" type="text" style="z-index:10000" name="node_name_${node.id}"><br></form>`).dialog({
            //             modal: true,
            //             buttons: {
            //                 'OK': function () {
            //                     updateNode(node);
            //                     jQuery(this).dialog('close').dialog('destroy');
            //                 },
            //                 'Cancel': function () {
            //                     jQuery(this).dialog('close').dialog('destroy');
            //                 }
            //             }
            //         });

            //         //
            //         // Avoid keypress redirections 
            //         //
            //         jQuery(`input[name="node_name_${node.id}"]`).keypress(function(event) {
            //             if (KEY_ENTER === event.keyCode) {
            //                 event.preventDefault();
            //                 updateNode(node);
            //                 jQuery(this).parents('.ui-dialog-content').dialog('close').dialog('destroy');
            //             }
            //         });
            //     }
            // });

            //
            // Toogle Steps
            //
            $tree.on('click', '.buddyforms-sf-step-header', function(event) {
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                buddyforms_toggle_step($tree, node_id);
            });

            //
            // Display Field Sidebar Menu
            //
            $tree.on('tree.select', function (event) {
                if (event.node) {
                    jQuery('#step-form-node-options').html(`Field Sidebar menu: ${event.node.name}`);
                }
            });

            //
            // Display Step Sidebar Menu
            //
            $tree.on('click', '.buddyforms-sf-step-options', function(event){
                event.stopPropagation();

                const node_id = jQuery(event.currentTarget).data('node-id');
                const node = $tree.tree('getNodeById', node_id);
                jQuery('#step-form-node-options').html(`Step Sidebar menu: ${node.name}`);
            });

            //
            // Display Global Sidebar Menu
            //
            jQuery(document.body).on('click', '.buddyforms-sf', function(event) {            
                if(!jQuery(event.target).closest(".buddyforms-sf-field, .buddyforms-sf-sidebar, a, select").length){ 
                    $tree.tree('selectNode', null);
                    jQuery('#step-form-node-options').html('Global Sidebar menu');          
                }
            });

        }

    });
}


/**
 * @param {JQuery object} $tree 
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
 * @param {JQuery object} $tree 
 * @param {int|string} node_id
 */
function buddyforms_delete_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    $tree.tree('removeNode', node);
}

/**
 * 
 * @param {JQuery object} $tree 
 * @param {int|string} node_id 
 */
function buddyforms_toggle_step($tree, node_id) {
    const node = $tree.tree('getNodeById', node_id);
    $tree.tree( 
        !node.is_open ? 'openNode' : 'closeNode', 
        node
    );
}

/**
 * @param {object} node 
 * @param {jQuery object} $el 
 */
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
                <p>${node.name}</p>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-add-step-before buddyforms-sf-btn">
                    Add Before
                    <span class="iconify" data-icon="dashicons-insert-before" data-inline="false"></span>
                </a>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-add-step-after buddyforms-sf-btn">
                    Add After
                    <span class="iconify" data-icon="dashicons-insert-after" data-inline="false"></span>
                </a>
                <a href="#" data-node-id="${node.id}" class="buddyforms-sf-step-options buddyforms-sf-btn">
                    Step Options
                    <span class="iconify" data-icon="dashicons:admin-generic" data-inline="false"></span>
                </a>
            </header>
        `)
    ;
}

/**
 * @param {object} node 
 * @param {JQuery object} $li 
 */
function buddyforms_init_field_node(node, $li) {
    $li.find('.jqtree-element')
       .addClass('buddyforms-sf-field')
       .addClass('buddyforms-sf-box-small')
    ;
}