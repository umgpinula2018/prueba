jQuery(document).ready(function ($) {

    function execCode() {
        
        var record_id = 0;

        if (!jQuery.fn.modal) {
            $.when(
                $.getScript('js/bootstrap.min.js'),
                $.Deferred((deferred) => {
                    $(deferred.resolve);
                })
            ).done(() => {
                console.log(jQuery.fn.modal);
            });
        }

        if ($.fn.DataTable) {
            window.tabla_registros = $("#records-table").DataTable({
                'oLanguage': {
                    'sLengthMenu': 'Mostrando _MENU_ filas',
                    'sSearch': '',
                    'sProcessing': 'Procesando...',
                    'sLengthMenu': 'Mostrar _MENU_ registros',
                    'sZeroRecords': 'No se encontraron resultados',
                    'sEmptyTable': 'Ningún dato disponible en esta tabla',
                    'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                    'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
                    'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
                    'sInfoPostFix': '',
                    'sSearch': 'Buscar:',
                    'sUrl': '',
                    'sInfoThousands': '',
                    'sLoadingRecords': 'Cargando...',
                    'oPaginate': {
                        'sFirst': 'Primero',
                        'sLast': 'Último',
                        'sNext': 'Siguiente',
                        'sPrevious': 'Anterior'
                    }
                }
            });
        } else {
            $.when(
                $.getScript('js/jquery.dataTables.js'),
                $.Deferred((deferred) => {
                    jQuery(deferred.resolve);
                })
            ).done(() => {
                window.tabla_registros = jQuery("#records-table").DataTable({
                    'oLanguage': {
                        'sLengthMenu': 'Mostrando _MENU_ filas',
                        'sSearch': '',
                        'sProcessing': 'Procesando...',
                        'sLengthMenu': 'Mostrar _MENU_ registros',
                        'sZeroRecords': 'No se encontraron resultados',
                        'sEmptyTable': 'Ningún dato disponible en esta tabla',
                        'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                        'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
                        'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
                        'sInfoPostFix': '',
                        'sSearch': 'Buscar:',
                        'sUrl': '',
                        'sInfoThousands': '',
                        'sLoadingRecords': 'Cargando...',
                        'oPaginate': {
                            'sFirst': 'Primero',
                            'sLast': 'Último',
                            'sNext': 'Siguiente',
                            'sPrevious': 'Anterior'
                        }
                    }
                });
            });
        }


        loadTable();
        clearInputs();
        /**
         * Eventos
         */
        $('#records-table').on('click', 'a.btn-show', showRecord);
        $('#records-table').on('click', 'a.btn-delete', showDeleteRecord);
        $('#btn-store').on('click', storeRecord);
        $('#btn-edit').on('click', updateRecord);
        $('#btn-delete').on('click', deleteRecord);
        $(document).on('click', '.btn-add-letter-sanction', openModalLetterSanction);
        $('.fields-employee').on('click', '.field-employee, .field-form-fault', addFieldEmployeeOnLetter);
        $("#new-record").on('click', function (e) {
            e.preventDefault();
            $("#store-modal").modal();
        });

        $('#editor').on('input', '.input-field-letter', function inputLetter(e) {
            if ($(this).hasClass('error_input')) {
                $(this).removeClass('error_input')
            }
        });
        
        $("#editor").on('keydown', '.input-field-letter', function (event) {
            
            $("#ruler_element").text(this.value);

            if(event.keyCode == 8 || event.keyCode == 46) {
                        
                $(this).css({
                    width: `${($("#ruler_element")[0].offsetWidth)}px`
                });
                return; 
            }
            else {
                $(this).css({
                    width: `${($("#ruler_element")[0].offsetWidth) + 12}px`
                });
                return;
            }

        });

        $("#btn-save-letter").on('click', saveLetter);
        $(document).on('click', '.btn-edit-letter-sanction', editLetter);

        /**
         * Funcionalidad para editor de texto
         */

        var colorPalette = ['000000', 'FF9966', '6699FF', '99FF66', 'CC0000', '00CC00', '0000CC', '333333', '0066FF', 'FFFFFF'];
        var forePalette = $('.fore-palette');
        var backPalette = $('.back-palette');

        for (var i = 0; i < colorPalette.length; i++) {
            forePalette.append('<a href="#" data-command="forecolor" data-value="' + '#' + colorPalette[i] + '" style="background-color:' + '#' + colorPalette[i] + ';" class="palette-item"></a>');
            backPalette.append('<a href="#" data-command="backcolor" data-value="' + '#' + colorPalette[i] + '" style="background-color:' + '#' + colorPalette[i] + ';" class="palette-item"></a>');
        }

        $('.toolbar a').click(function (e) {
            var command = $(this).data('command');
            if (command == 'h1' || command == 'h2' || command == 'p') {
                document.execCommand('formatBlock', false, command);
            }
            if (command == 'forecolor' || command == 'backcolor') {
                document.execCommand($(this).data('command'), false, $(this).data('value'));
            }
            if (command == 'createlink' || command == 'insertimage') {
                url = prompt('Enter the link here: ', 'http:\/\/');
                document.execCommand($(this).data('command'), false, url);
            } else document.execCommand($(this).data('command'), false, null);
        });

        /**
         * Fin funcionalidad editor de texto
         */

        
        function loadTable() {
            $('#loader').show();
            $.ajax({
                type: 'GET',
                url: 'ws/medidas/amonestaciones',
                dataType: 'json'
            }).done(function (response) {
                window.tabla_registros.clear().draw(false);
                $.each(response.records, function (index, value) {
                    col1 = ++index;
                    col2 = value.descripcion;
                    col3 = value.carta_txt;
                    col4 = '<a href="#edit-modal" class="btn btn-xs btn-primary btn-show" data-toggle="modal" data-id="' + value.id + '"><i class="glyphicon glyphicon-edit"></i> Editar</a>';
                    if (value.carta_text.trim() == '')
                        col4 += '<a href="#" data-id="' + value.id + '" style="margin-left: 4px; margin-right: 3px;" class="btn btn-xs btn-primary btn-add-letter-sanction"><i class="glyphicon glyphicon-plus"></i> CARTA</a>';
                    else
                        col4 += '<a href="#" data-id="' + value.id + '" style="margin-left: 4px; margin-right: 3px;" class="btn btn-xs btn-primary btn-edit-letter-sanction">EDITAR CARTA</a>';

                    col4 += '<a href="#delete-modal" class="btn btn-xs btn-danger btn-delete"  data-toggle="modal" data-id="' + value.id + '" style="margin-left: 1%"><i class="glyphicon glyphicon-trash"></i> Eliminar</a>';
                    /*col4 = '<a href="#edit-modal" class="btn btn-xs btn-primary btn-show" data-toggle="modal" data-id="'+value.id+'"><i class="glyphicon glyphicon-edit"></i> Editar</a>'+
                        '<a href="#" data-id="'+value.id+'" style="margin-left: 4px; margin-right: 3px;" class="btn btn-xs btn-primary btn-add-letter-sanction"><i class="glyphicon glyphicon-plus"></i> CARTA</a>' +
                        '<a href="#delete-modal" class="btn btn-xs btn-danger btn-delete"  data-toggle="modal" data-id="'+value.id+'" style="margin-left: 1%"><i class="glyphicon glyphicon-trash"></i> Eliminar</a>';*/

                    window.tabla_registros.row.add([col1, col2, col3, col4]).draw(false);
                });
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {
                $('#loader').fadeOut();
            });
        }

        function storeRecord(event) {
            event.preventDefault();
            data = {
                descripcion: $('#store-form #descripcion').val(),
                carta: '',
                carta_txt: ''
            };

            if(data.descripcion.trim().length == 0) {
                toastr.warning("El campo descripción es obligatorio. No puede quedar vacío");
                return;
            }

            $.ajax({
                type: 'POST',
                url: 'ws/medidas/amonestaciones',
                dataType: 'json',
                data: data
            }).done(function (response) {
                loadTable();
                $('#store-modal').modal('hide');
                toastr['success'](response.message, 'Éxito');
                clearInputs();
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {

            });
        }

        function showRecord(event) {
            event.preventDefault();
            record_id = $(this).data('id');
            $.ajax({
                type: 'GET',
                url: 'ws/medidas/amonestaciones/' + record_id,
                dataType: 'json'
            }).done(function (response) {
                $('#edit-form #descripcion').val(response.records.descripcion);
                $('#edit-form #carta').val(response.records.carta);
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {

            });
        }

        function updateRecord(event) {
            event.preventDefault();
            data = {
                descripcion: $('#edit-form #descripcion').val(),
                carta: $('#edit-form #carta').val(),
                carta_txt: $("#edit-form #carta option:selected").text()
            };

            if(data.descripcion.trim().length == 0) {
                toastr.warning("El campo descripción es obligatorio. No puede quedar vacío");
                return;
            }

            $.ajax({
                type: 'PUT',
                url: 'ws/medidas/amonestaciones/' + record_id,
                dataType: 'json',
                data: data
            }).done(function (response) {
                loadTable();
                $('#edit-modal').modal('hide');
                toastr['success'](response.message, 'Éxito');
                clearInputs();
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {

            });
        }

        function showDeleteRecord(event) {
            event.preventDefault();
            record_id = $(this).data('id');
        }

        function deleteRecord(event) {
            event.preventDefault();
            $.ajax({
                type: 'DELETE',
                url: 'ws/medidas/amonestaciones/' + record_id,
                dataType: 'json'
            }).done(function (response) {
                loadTable();
                $('#delete-modal').modal('hide');
                toastr['success'](response.message, 'Éxito');
            }).fail(function (response) {
                toastr['error'](response.message, 'Error');
            }).always(function () {

            });
        }

        function openModalLetterSanction(e) { //Abrir modal donde se redactará el formato de la carta
            e.preventDefault();
            var sanction = $(this).parent().siblings().eq(1).text(); //Se obtiene el nombre de la sanción, que está en la segunda columna de la tabla (indice 1, si es un array)
            var idSanction = $(this).attr("data-id"); //Se obtiene el ID de la sanción
            $("#carta-amonestacion #editor").html("");
            $("#carta-amonestacion").attr("data-id", idSanction); //Se 'settea' un atributo data-id del modal, que contendrá el ID de la amonestación
            $("#carta-amonestacion #amonestacion").text(sanction); //Se cambia el título de la carta, para que aparezca el nombre de la sanción que se seleccionó
            $("#carta-amonestacion").modal(); //Se abre el modal
        }

        function clearInputs() {
            $('#store-form')[0].reset();
            $('#edit-form')[0].reset();
        }

        var indexInput = uniqueRandom(1, 10000000000000);

        /**
         * [addFieldEmployeeOnLetter Función que se ejecutará al presionar algún botón del listado de los campos de usuario a agregar a la carta]
         * @param {[type]} e [description]
         */
        function addFieldEmployeeOnLetter(e) {
            e.preventDefault();
            var itemToAdd = $(this).text();
            var name = $(this).attr("data-name");            
            var text_width;
            const _itemToAdd = itemToAdd.trim().split(" ").join("_");

            /**
             * Se coloca el foco en el editor
             */
            $("#editor").focus();


            /**
             * [if Si el elemento que se quiere agregar tiene la clase input-field (definida en el archivo amonestaciones.blade.php en el botón de CAMPO DE TEXTO del editor de texto)]
             * @param  {[type]} $(this).hasClass('input-field') [description]
             * @return {[type]}                                 [description]
             */
            if ($(this).hasClass('input-field')) {
                pasteHtmlAtCaret("<input class='input-field-letter' data-index='" + indexInput() + "' style='display: inline-block;outline: none; border-top: none; width: 195px; border-bottom: 1px solid #AAA; border-left: none; border-right: none; background: #FFF;' placeholder='Escribe el nombre del campo' />");
                return;
            }

            /*var el = $("<span class='el_width'>"+ itemToAdd +"</span>");
            $("#ruler").html(el);
            var text_width = $("#ruler .el_width")[0].offsetWidth;*/

            $("#ruler_element").text(itemToAdd);
            
            text_width = $("#ruler_element")[0].offsetWidth;
            
            pasteHtmlAtCaret(`<input type="text" disabled data-name='${name}' class='field-to-replace ${_itemToAdd}' value='${itemToAdd}' style='width: ${text_width + 1}px; background: none;border: none;color: #009fb3;font-weight: bold;' />`);
            //pasteHtmlAtCaret("<span data-name='" + name + "' style='color: #F44336;font-weight: 600;' class='field-to-replace " + itemToAdd.trim().split(" ").join("_") + "'>" + itemToAdd + "</span>&nbsp;");
        }

        /**
         * [saveLetter Guardar carta]
         * @param  {[type]} e jQuery event
         * @return {[type]}   [description]
         */
        function saveLetter(e) {

            e.preventDefault();

            var editor = $("#editor");
            var string_editor = editor.clone().html().toString();
            const idSanction = $("#carta-amonestacion").attr("data-id");
            var sendRequest = true;

            /**
             * Se buscará entre los campos input con la clase input-field-letter para comprobar si ninguno está vacío.  De lo contrario, se mostrará un error
             * @param  {[type]} "input.input-field-letter").each((index, input         [description]
             * @return {[type]} [description]
             */
            editor.find("input.input-field-letter").each((index, input) => { //Se buscan los campos input dentro de la carta
                if ($(input).val().trim() == "") { //Se comprueba si un campo está vacío
                    $(input).addClass('error_input'); //Se le agrega la clase error_input que está al final del archivo amonestaciones.blade.php
                    if (sendRequest == true)
                        sendRequest = false;
                }
            });
            
            if (sendRequest) {
                editor.find("input.input-field-letter").each((index, input) => {
                    if ($(input).attr("data-previous")) { //Si ya tiene la propiedad data-previous, es porque ese elemento ya fue agregado
                        string_editor = string_editor.replace('data-index="' + $(input).attr("data-index") + '" value="' + $(input).attr("data-previous") + '" data-previous="' + $(input).attr("data-previous") + '"', 'data-index="' + $(input).attr("data-index") + '" value="' + $(input).val() + '" data-previous="' + $(input).val() + '"');
                    } else { //Es la primera vez que se modificará el elemento
                        string_editor = string_editor.replace('data-index="' + $(input).attr("data-index") + '"', 'data-index="' + $(input).attr("data-index") + '" value="' + $(input).val() + '" data-previous="' + $(input).val() + '"');
                    }
                });

                const xhr = $.post('ws/medidas/faltas/amonestaciones/carta', {
                    carta_id: idSanction,
                    carta: string_editor
                });

                xhr
                    .done(response => {
                        if (response.result) {
                            loadTable();
                            $("#carta-amonestacion").modal("hide");
                            toastr['success'](response.message, 'Éxito');
                        } else {
                            toastr['error']("Ocurrió un error.  Intenta nuevamente", "Error");
                        }
                    })
                    .fail(error => {
                        toastr['error'](response.message, 'Error');
                    });
            } else {
                toastr['error']('Debes agregarle un nombre a los campos de texto para que los pueda identificar', 'Error');
            }
        }
        
        function editLetter(e) {
            e.preventDefault();

            var sanction = $(this).parent().siblings().eq(1).text();
            var idSanction = $(this).attr("data-id");

            $("#carta-amonestacion").attr("data-id", idSanction);
            $("#carta-amonestacion #amonestacion").text(sanction);

            var xhr = $.get('ws/medidas/amonestaciones/' + idSanction);

            xhr
                .done(response => {
                    $("#carta-amonestacion #editor").html(response.records.carta_text);
                    $("#carta-amonestacion").modal();
                })
                .fail(error => {
                    console.log(error);
                    toastr.error(error.message);
                });
        }

        function uniqueRandom(min, max) {
            var prev;
            return function rand() {
                const num = Math.floor((Math.random() * (max - min + 1)) + min);
                prev = (num === prev && min !== max) ? rand() : num;
                return prev;
            };
        }
    }

    if ($.fn.DataTable) { //Si está definido $().DataTable;
        execCode();
    } else {
        $.getScript("js/jquery.dataTables.js", function () {
            execCode();
        });
    }
});