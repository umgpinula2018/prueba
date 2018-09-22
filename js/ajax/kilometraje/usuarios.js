jQuery(document).ready(function($){
	
    window.tabla_registros = $("#tabla-registros").DataTable(
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

    var id_registro = 0;
    var ideliminar  = 0;

    llenarTabla();
    
    $('#btn-crear').on('click', store);
    $('#btn-eliminar').on('click', destroy);
    $('#btn-actualizar').on('click', update);

    function limpia(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#form-crear #email').removeClass('valid');
        $('#form-crear #email').removeClass('error');
        $('#form-editar #email-edit').removeClass('valid');
        $('#form-editar #email-edit').removeClass('error');
    }
    $('#crear-usuario').on('click', limpia);
    function llenarTabla(){

        limpia();
        $('#loader').show();
    	window.tabla_registros.clear().draw();
        
    	$.ajax({
    		url: 		'ws/kilometraje/usuarios',
    		type: 		'GET',
    		dataType: 	'json'
    	})
    	.done(function(response){
    		if (response.result) {
    			cont = 0; acciones = '';
				$.each(response.records, function(index, value) {
					
            		acciones =  '<td>'+
									'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'" title="Actualizar usuario"><i class="fa fa-pencil"></i></a>'+
                                    '<a class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'" style="margin-left: 5px;" title="Eliminar usuario"><i class="fa fa-trash"></i></a>'+
								'</td>';
					col1 = ++cont;
                    col2 = value.nombre;
                    col3 = value.depto;
                    col4 = value.km_administrador == 1 ? '<center><span class="label label-success">Si</span></center>' : '<center><span class="label label-danger">No</span></center>';
                    col5 = value.km_supervisor    == 1 ? '<center><span class="label label-success">Si</span></center>' : '<center><span class="label label-danger">No</span></center>';
					col6 = value.km_rh            == 1 ? '<center><span class="label label-success">Si</span></center>' : '<center><span class="label label-danger">No</span></center>';
                    col7 = acciones;
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7]).draw(false);
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
        if( $( '#form-crear' ).valid() )
        {
            var datos = $('#form-crear').serialize();
            $.ajax(
                {
                    type: 		'POST',
                    url: 		'ws/kilometraje/usuarios',
                    dataType: 	'json',
                    data: 		datos,
                    success: function( result )
                    {
                        if( result.result )
                        {
                            $('#modal-crear').modal('hide');
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
                        console.log( result );
                        toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    }
                });
        }
    }

    $('#tabla-registros').on('click', 'a.btn-editar', function(){
        id_registro = $(this).data('idregistro');
        limpia();
        $.ajax({
            url:        'ws/kilometraje/usuarios/'+id_registro,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    $('#form-editar #email-edit').val(response.records.email);
                    response.records.km_administrador == 1 ? $("#form-editar #administrador").attr('checked', true) : $("#form-editar #administrador").attr('checked', false);
                    response.records.km_supervisor    == 1 ? $("#form-editar #supervisor").attr('checked', true) : $("#form-editar #supervisor").attr('checked', false);
                    response.records.km_rh            == 1 ? $("#form-editar #rh").attr('checked', true) : $("#form-editar #rh").attr('checked', false);
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){})
    });

    function update(e){
        e.preventDefault();
        if( $('#form-editar').valid() )
        {
            $.ajax
            ({
                type: 		'PUT',
                url: 		'ws/kilometraje/usuarios/'+id_registro,
                dataType: 	'json',
                data: 		$('#form-editar').serialize(),
                success: function ( result )
                {
                    if( result.result )
                    {
                        setTimeout( function(){ amigable(); }, 500);
                        toastr['success'](result.message, 'Éxito')
                        $('#modal-editar').modal('hide');
                    }
                    else
                    {
                        toastr['error'](result.message, 'Error');
                    }
                },
                error: function ( result )
                {
                    console.log(result);
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                }
            });
        }
    }

    $("#tabla-registros").on('click', 'a.btn-eliminar', function( e ){
        ideliminar = $(e.target).closest("a").data("idregistro");
    });

    function destroy( e )
    {
        e.preventDefault();
        $.ajax(
            {
                type:	"DELETE",
                url:	"ws/kilometraje/usuarios/"+ideliminar,
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

	$("#form-editar").validate({
		rules:{
			kilometraje:{
				required: true,
			}
		},
		messages:{
			kilometraje:{
				required: 'Este campo es obligatorio'
			}
		}
	});

});