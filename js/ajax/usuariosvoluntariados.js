jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;

	//Propiedades
	window.tabla_registros = $('#tabla-registros').DataTable(
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
	
	function limpiar (){
        $('#form-crear')[0].reset();
        $('#form-crear').validate().resetForm();

        $('.form-control').removeClass('valid');
        $('#email').removeClass('error');
    }
    $('#crearRegistro').on('click',function(){
    	limpiar();
    });
    $('#btn-cerrar').on('click',function(){
    	limpiar();
    });

	//Eventos
	llenarTabla();
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	
	//Funciones
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type:  		'GET',
			url: 		'ws/usuariosvoluntariados',
			dataType: 	'json',
		})
		.done( function( data )
		{
			if( data.result )
			{
				$.each(data.records, function( index, value )
				{	
					col1 = ++index;
					col2 = value.nombre;
					col3 = value.email;
					col4 = value.depto;
					col5 = value.voluntariados_admin == 1 ? '<span class="label label-success">Si</span>' : '<span class="label label-danger">No</span>' ;
					col6 = value.voluntariados_crear == 1 ? '<span class="label label-success">Si</span>' : '<span class="label label-danger">No</span>' ;
					col7 = value.voluntariados_aprob == 1 ? '<span class="label label-success">Si</span>' : '<span class="label label-danger">No</span>' ;
					col8 = value.voluntariados_carga_masiva == 1 ? '<span class="label label-success">Si</span>' : '<span class="label label-danger">No</span>' ;
					col9 = 	'<a class="btn btn-primary btn-xs btn-editar" href="#modal-editar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
						    '<a style=" margin: 5px;" class="btn btn-danger btn-xs btn-eliminar" href="#modal-eliminar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-trash-o "></i></a>';
							
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9]).draw(false);
				});
			}
			else
				console.log( data.message );
		})
		.fail( function( err ) 
		{
			console.log( err );
		})
		.always( function(  ) 
		{
			$('#loader').fadeOut();
		});
	}

	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/usuariosvoluntariados',
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

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/usuariosvoluntariados/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #email").val(result.records[0].email);
		            $("#form-editar #nombre").val(result.records[0].nombre);
		            result.records[0].voluntariados_admin == 1 ? $("#form-editar #administrador").attr('checked', true) : $("#form-editar #administrador").attr('checked', false);
		            result.records[0].voluntariados_crear == 1 ? $("#form-editar #crearvoluntariado").attr('checked', true) : $("#form-editar #crearvoluntariado").attr('checked', false);
		            result.records[0].voluntariados_aprob == 1 ? $("#form-editar #aprobarvoluntariado").attr('checked', true) : $("#form-editar #aprobarvoluntariado").attr('checked', false);
		            result.records[0].voluntariados_carga_masiva == 1 ? $("#form-editar #cargamasiva").attr('checked', true) : $("#form-editar #cargamasiva").attr('checked', false);
          		}

		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	        },
	        error: function( data )
        	{
        		console.log( data );
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/usuariosvoluntariados/'+idregistro,
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
			url:	"ws/usuariosvoluntariados/"+ideliminar,
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

	$("#form-crear").validate({
        rules:{
            voluntariado:{
                required: true,
            }
        },
        messages:{
            voluntariado:{
                required: 'Este campo es obligatorio'
            }
        }
    });
});