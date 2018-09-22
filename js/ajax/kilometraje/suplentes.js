jQuery(document).ready(function ($) {

    window.tabla_registros = $("#tabla-suplentes").DataTable(
        {
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
    
    /*
     * Variables globales
     * 
    */
    var id_registro = 0;
    var id_eliminar = 0;

    llenarTabla();
    $('#btn-crear').on('click', store);
    $('#btn-modificar').on('click', update);
    $('#btn-eliminar').on('click', destroy);

    function llenarTabla() {

        $('#loader').show();
        window.tabla_registros.clear().draw();

        $.ajax({
            url: 'ws/kilometraje/suplentes',
            type: 'GET',
            dataType: 'json'
        })
            .done(function (response) {
                if (response.result) {
                    cont = 0; acciones = '';
                    $.each(response.records, function (index, value) {

                        acciones = '<td>' +
                            '<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="' + value.id + '" title="Actualizar usuario"><i class="fa fa-pencil"></i></a>' +
                            '<a class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="' + value.id + '" style="margin-left: 5px;" title="Eliminar usuario"><i class="fa fa-trash"></i></a>' +
                            '</td>';

                        col1 = ++cont;
                        col2 = value.nombre;
                        col3 = value.pernr_agente;
                        col4 = value.email;
                        col5 = value.tipo == 0 ? '<center><span class="label label-info">Agente</span></center>' : '<center><span class="label label-info">Supervisor de ruta</span></center>';
                        col6 = value.estado == 1 ? '<center><span class="label label-danger">Activo</span></center>' : '<center><span class="label label-success">No activo</span></center>';
                        col7 = acciones;
                        window.tabla_registros.row.add([col1, col2, col3, col4, col5, col6, col7]).draw(false);
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () { $('#loader').fadeOut(); })
    }

    function store(e) {
        e.preventDefault();
        if ($('#form-crear').valid()) {
            $('#loader').show();
            $.ajax(
                {
                    type: 'POST',
                    url: 'ws/kilometraje/suplentes',
                    dataType: 'json',
                    data: $('#form-crear').serialize(),
                    success: function (result) {
                        if (result.result) {
                            $('#modal-crear').modal('hide');
                            toastr['success'](result.message, 'Éxito');
                            setTimeout(function () { amigable(); }, 500);
                        }
                        else {
                            $('#loader').hide();
                            toastr['error'](result.message, 'Error');
                        }
                    },
                    error: function (result) {
                        $('#loader').hide();
                        console.log(result);
                        toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    }
                });
        }
    }

    $('#tabla-suplentes').on('click', 'a.btn-editar', function () {
        id_registro = $(this).data('idregistro');
        $.ajax({
            url: 'ws/kilometraje/suplentes/' + id_registro,
            type: 'GET',
            dataType: 'json'
        })
            .done(function (response) {
                if (response.result) {
                    $('#form-editar #emial-edit').val(response.records.email);
                    response.records.tipo == 1 ? $("#form-editar #type").attr('checked', 'checked') : $("#form-editar #type").removeAttr('checked', 'checked');
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () { })
    });

    function update(e) {
        e.preventDefault();
        if ($('#form-editar').valid()) {
            $.ajax
                ({
                    type:     'PUT',
                    url:      'ws/kilometraje/suplentes/' + id_registro,
                    dataType: 'json',
                    data:     $('#form-editar').serialize(),
                    success: function (result) {
                        if (result.result) {
                            setTimeout(function () { amigable(); }, 500);
                            toastr['success'](result.message, 'Éxito')
                            $('#modal-editar').modal('hide');
                        }
                        else {
                            toastr['error'](result.message, 'Error');
                        }
                    },
                    error: function (result) {
                        console.log(result);
                        toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    }
                });
        }
    }

    $("#tabla-suplentes").on('click', 'a.btn-eliminar', function( e ){
        id_eliminar = $(e.target).closest("a").data("idregistro");
    });

    function destroy( e )
    {
        e.preventDefault();
        $.ajax(
            {
                type:	"DELETE",
                url:	"ws/kilometraje/suplentes/"+id_eliminar,
                success: function( result )
                {
                    if( result.result )
                    {
                        toastr['success'](result.message, 'Éxito')
                        setTimeout( function(){ amigable(); }, 500);
                        $("#modal-eliminar").modal('hide');
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                    }
                },
                error: function( result )
                {
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                }
            });
    }

});