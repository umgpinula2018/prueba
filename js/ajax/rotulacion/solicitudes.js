jQuery(document).ready(function ($) {

    var id = 0;

    window.tabla_solicitudes = $("#tabla-solicitudes").DataTable(
        {
            "oLanguage": {
                "sLengthMenu": "Mostrando _MENU_ filas",
                "sSearch": "",
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "Ningún dato disponible en esta tabla",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                }
            }
        });

    fillTable();
    $('#btn-pass').on('click', toPass);
    $('#btn-reject').on('click', toReject);

    function clear(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#input_c').removeClass('valid');
        $('#input_m').removeClass('valid');
        $('#input_c').removeClass('error');
        $('#input_m').removeClass('error');
    }

    function fillTable(){
        window.tabla_solicitudes.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/solicitudes',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {

                    var acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>'+
                            '<a class="btn btn-success btn-xs btn-approve" href="#modal-toPass" data-toggle="modal"  data-idrequest="'+value.id+'" title="Actualizar tipo de usuario"><i class="fa fa-check"></i></a>'+
                            '<a class="btn btn-danger btn-xs btn-reject" href="#modal-toReject" data-toggle="modal"  data-idrequest="'+value.id+'" style="margin-left: 5px;" title="Eliminar el tipo de usuario"><i class="fa fa-close"></i></a>'+
                            '</td>';

                        switch(parseInt(value.estado)){
                            case 0:
                                estado = '<span class="label label-default">Pendiente de Arte</span>';
                                break;
                            case 1:
                                estado = '<span class="label label-info">En proceso</span>';
                                break;
                            case 2:
                                estado = '<span class="label label-success">Aprobado</span>';
                                break;
                            case 3:
                                estado = '<span class="label label-danger">Rechazado</span>';
                                break;
                        }

                        switch(parseInt(value.tipo)){
                            case 1:
                                tipo_rotulacion = '<span class="label label-info">RETIRO DE ROTULACIÓN</span>';
                                break;
                            case 2:
                                tipo_rotulacion = '<span class="label label-info">NUEVA INSTALACIÓN DE ROTULACIÓN</span>';
                                break;
                            case 3:
                                tipo_rotulacion = '<span class="label label-info">MANTENIMIENTO DE ROTULACIÓN</span>';
                                break;
                        }

                        col1 = value.id;
                        col2 = value.nombre;
                        col3 = value.empid;
                        col4 = tipo_rotulacion;
                        col5 = value.requisito === 0 ?'<span class="label label-default">Lineal</span>':'<span class="label label-success">Especial</span>';
                        col6 = estado;
                        col7 = value.created_at;
                        col8 = acciones;
                        window.tabla_solicitudes.row.add([col1,col2,col3,col4,col5,col6,col7,col8]).draw(false);
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); });
    }

    $('#tabla-solicitudes').on('click', 'a.btn-approve', function (e) {
        e.preventDefault();
        id = $(e.target).closest("a").data("idrequest");
    });
    
    function toPass(e) {
        e.preventDefault();
            $.ajax
            ({
                url: 		'ws/rotulacion/solicitudes/'+id,
                type: 		'PUT',
                dataType: 	'json',
                data: 		{ status: 1 },
                success: function ( result )
                {
                    if( result.result )
                    {
                        setTimeout( function(){ amigable(); }, 500);
                        toastr['success'](result.message, 'Éxito');
                        $('#modal-toPass').modal('hide');
                        $('#loader').fadeOut();
                        fillTable();
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                        $('#loader').fadeOut();
                    }
                },
                error: function ( result )
                {
                    console.log(result);
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    $('#loader').fadeOut();
                }
            });

    }

    $('#tabla-solicitudes').on('click', 'a.btn-reject', function (e) {
        e.preventDefault();
        id = $(e.target).closest("a").data("idrequest");
    });

    function toReject(e) {
        e.preventDefault();
        $.ajax
        ({
            url: 		'ws/rotulacion/solicitudes/'+id,
            type: 		'PUT',
            dataType: 	'json',
            data: 		{ status: 2 },
            success: function ( result )
            {
                if( result.result )
                {
                    setTimeout( function(){ amigable(); }, 500);
                    toastr['success'](result.message, 'Éxito');
                    $('#modal-toReject').modal('hide');
                    $('#loader').fadeOut();
                    fillTable();
                }
                else
                {
                    toastr['error'](result.message, 'Error');
                    $('#loader').fadeOut();
                }
            },
            error: function ( result )
            {
                console.log(result);
                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                $('#loader').fadeOut();
            }
        });

    }
});
