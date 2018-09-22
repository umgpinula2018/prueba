jQuery(document).ready(function ($) {
    var id = 0;
    var id_delete = 0;
    window.tabla_usuarios = $("#tabla-usuarios").DataTable(
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

    $('#btn-create').on('click', store);
    $('#btn-update').on('click', update);
    $('#btn-remove').on('click', remove);
    $('#btn-new').on('click', clear);

    function fillTable() {
        window.tabla_usuarios.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/tipos/usuarios',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {

                    cont = 0; acciones = '';
                    $.each(response.records, function(index, value) {

                        acciones =  '<td>'+
                            '<a class="btn btn-primary btn-xs btn-edit" href="#modal-edit" data-toggle="modal"  data-iduser="'+value.id+'" title="Actualizar tipo de usuario"><i class="fa fa-pencil"></i></a>'+
                            '<a class="btn btn-danger btn-xs btn-remove" href="#modal-remove" data-toggle="modal"  data-iduser="'+value.id+'" style="margin-left: 5px;" title="Eliminar el tipo de usuario"><i class="fa fa-trash"></i></a>'+
                            '</td>';

                        col1 = ++cont;
                        col2 = value.nombre;
                        col3 = acciones;
                        window.tabla_usuarios.row.add([col1,col2,col3]).draw(false);
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
    }

    function store(e) {
        e.preventDefault();
        if( $('#form-create').valid() )
        {
            $.ajax({
                url: 		'ws/rotulacion/tipos/usuarios',
                type: 		'POST',
                dataType: 	'json',
                data: 		$('#form-create').serialize(),
                success: function( result )
                {
                    if( result.result )
                    {
                        $('#modal-create').modal('hide');
                        toastr['success'](result.message, 'Éxito');
                        setTimeout( function(){ amigable(); }, 500);
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                    }
                },
                error: 	function( result )
                {
                    console.error( result );
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                }
            });
        }
    }

    $('#tabla-usuarios').on('click', 'a.btn-edit', function(){
        id = $(this).data('iduser');
        $.ajax({
            url:        'ws/rotulacion/tipos/usuarios/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-edit #name').val(response.records.nombre);
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){})
    });

    function update(e) {
        e.preventDefault();
        if( $('#form-edit').valid() )
        {
            $.ajax
            ({
                type: 		'PUT',
                url: 		'ws/rotulacion/tipos/usuarios/'+id,
                dataType: 	'json',
                data: 		$('#form-edit').serialize(),
                success: function ( result )
                {
                    if( result.result )
                    {
                        setTimeout( function(){ amigable(); }, 500);
                        toastr['success'](result.message, 'Éxito');
                        $('#modal-edit').modal('hide');
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                    }
                },
                error: function ( result )
                {
                    console.error(result);
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                }
            });
        }
    }

    $("#tabla-usuarios").on('click', 'a.btn-remove', function( e ){
        id_delete = $(e.target).closest("a").data("iduser");
    });

    function remove(e) {
        e.preventDefault();
        $.ajax(
            {
                type:	"DELETE",
                url:	"ws/rotulacion/tipos/usuarios/"+id_delete,
                success: function( result )
                {
                    if( result.result )
                    {
                        toastr['success'](result.message, 'Éxito')
                        setTimeout( function(){ amigable(); }, 500);
                        $("#modal-remove").modal('hide');
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

    function clear(e) {
        e.preventDefault();
        $('#form-create')[0].reset();
        $("#form-create").validate().resetForm();
        $('#form-create #name').removeClass('valid');
        $('#form-create #name').removeClass('error');
    }
});