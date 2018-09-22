jQuery(document).ready(function ($) {

    var idregistro = 0;

    $('.chosen-select').chosen({
        'search_contains': true,
        'width': '100%',
        'white-space': 'nowrap',
        'allow_single_deselect': true,
        'disable_search_threshold': 10,
        'no_results_text': "Oops, no encontro ningun ceco con este nombre: ",
    });

    window.tabla_registros = $("#tabla-registros").DataTable({
        "oLanguage": {
            "sLengthMenu": "Mostrando _MENU_ filas",
            "sSearch": "",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        }
    });

    fullTable();
    $('#btn-crear').on('click',createGruop);
    $('#btn-actualizar').on('click',update);
    $('#btn-eliminar').on('click',distroy);
    $('#btn-nuevo').on('click',clear);
    llenarCecos('#form-crear #cecos');
    llenarCecos('#form-editar #cecos');

    function clear(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#form-crear #nombre').removeClass('valid');
        $('#form-editar #nombre').removeClass('valid');
        $('#form-crear #nombre').removeClass('error');
        $('#form-editar #nombre').removeClass('error');
        $('#form-crear #cecos').val('').trigger('chosen:updated');
    }

    function fullTable() {
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 'ws/voluntariados/grupos/cecos',
            type: 'GET',
            dataType: 'json'
        })
            .done(function (response) {
                if (response.result) {
                    cont = 0;
                    $.each(response.records, function (index, value) {

                        acciones = '<td>' +
                            '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="' + value.id + '" title="Actualizar grupo de cecos"><i class="fa fa-pencil"></i></a>' +
                            '<a class="btn btn-danger btn-xs btn-eliminar" style="margin:3px;" href="#modal-eliminar" data-toggle="modal"  data-idregistro="' + value.id + '" title="Eliminar grupo de cecos"><i class="fa fa-trash"></i></a>' +
                            '</td>';

                        col1 = ++cont;
                        col2 = value.nombre;
                        col3 = '<span class="label label-success"><strong>'+value.cecos+'</strong></span>';
                        col4 = acciones;
                        window.tabla_registros.row.add([col1, col2, col3, col4]).draw(false);
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            });
    }

    function llenarCecos(selector)
    {
        $.ajax(
            {
                type: 		'GET',
                url: 		'ws/cecos/lista',
                dataType: 	'json',
            })
            .done(function( data )
            {
                if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $.each(data.records.TI_CECO.item, function( index, value )
                    {
                        $(selector).append($("<option />").val(value.KOSTL).text(value.LTEXT+' - '+value.KOSTL));
                    });

                    $(selector).select2({ });
                }
                else
                    console.log(data.message);
            })
            .fail(function( err )
            {
                console.log( err );
            })
            .always(function() { });
    }
    
    function createGruop() {
        var cecos;
        if ($('#form-crear').valid()) {
            cecos = $('#cecos').val();
            if(cecos){
                $('#loader').show();
                $.ajax({
                    url: 'ws/voluntariados/grupos/cecos',
                    type: 'POST',
                    dataType: 'json',
                    data: $('#form-crear').serialize()+'&cecos='+cecos
                })
                    .done(function (response) {
                        if (response.result) {
                            toastr['success'](response.message, 'Éxito');
                            $("#modal-crear").modal('hide');
                            fullTable();
                        } else {
                            toastr['error'](response.message, 'Error');
                        }
                    })
                    .fail(function (response) {
                        toastr['error'](response.message, 'Error');
                    })
                    .always(function () {
                        $('#loader').fadeOut();
                    });
            } else {
                toastr['warning']('Debe incluir los cecos', 'Error');
            }
        }
    }

    $("#tabla-registros").on('click', 'a.btn-editar', function (e) {
        e.preventDefault();
        idregistro = $(e.target).closest("a").data("idregistro");
        $.ajax({
            type: "GET",
            url: "ws/voluntariados/grupos/cecos/" + idregistro,
            success: function (result) {
                if (result.result) {
                    $("#form-editar #nombre").val(result.records.nombre);
                    $('#form-editar #cecos').val(result.records.cecos).trigger("change");
                }
                else {
                    toastr['error'](result.message, 'Error');
                    $("#modal-editar").modal('hide');
                }
            },
            error: function () {
                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
            }
        });
    });

    function update(e){
        e.preventDefault();
        var cecos;
        if ($('#form-editar').valid()) {
            cecos = $('#form-editar #cecos').val();
            if(cecos){
                $('#loader').show();
                $.ajax({
                    url: 'ws/voluntariados/grupos/cecos/'+idregistro,
                    type: 'PUT',
                    dataType: 'json',
                    data: $('#form-editar').serialize()+'&cecos='+cecos
                })
                    .done(function (response) {
                        if (response.result) {
                            toastr['success'](response.message, 'Éxito');
                            $("#modal-editar").modal('hide');
                            fullTable();
                        } else {
                            toastr['error'](response.message, 'Error');
                        }
                    })
                    .fail(function (response) {
                        toastr['error'](response.message, 'Error');
                    })
                    .always(function () {
                        $('#loader').fadeOut();
                    });
            } else {
                toastr['warning']('Debe incluir los cecos', 'Error');
            }
        }

    }

    $('#tabla-registros').on('click','a.btn-eliminar', function (e) {
        e.preventDefault();
        idregistro = $(this).data('idregistro');
    })

    function distroy(e) {
        e.preventDefault();
        $.ajax({
            url: 'ws/voluntariados/grupos/cecos/' + idregistro,
            type: 'DELETE',
            dataType: 'json',
        })
            .done(function (response) {
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    $("#modal-eliminar").modal('hide');
                    fullTable();
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            });
    }

});