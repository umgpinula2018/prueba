jQuery( document ).ready( function( $ ){

	var ideditar   = 0;
	var ideliminar = 0;
	var idestado   = 0;

	window.tablaAreas = $("#tabla-registros").DataTable(
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

	llenarTabla();
	llenarSociedades('#form-crear #sociedad');
	limpia();

	function limpia(){
        $('#form-crear')[0].reset();
		$("#form-crear").validate().resetForm();
        $('#form-crear #sociedad')    .removeClass('valid');
        $('#form-crear #sociedad')    .removeClass('error');
        $('#form-crear #nombre')      .removeClass('valid');
        $('#form-crear #nombre')      .removeClass('error');
        $('#form-crear #descripcion') .removeClass('valid');
        $('#form-crear #descripcion') .removeClass('error');

        $('#form-editar').validate().resetForm();
        $('#form-editar #editSociedad')    .removeClass('valid');
        $('#form-editar #editSociedad')    .removeClass('error');
        $('#form-editar #editNombre')      .removeClass('valid');
        $('#form-editar #editNombre')      .removeClass('error');
        $('#form-editar #editDescripcion') .removeClass('valid');
        $('#form-editar #editDescripcion') .removeClass('error');
    }

    $('#crearRegistro').on('click',function(){ limpia(); });

    // $('#btn-editar-cerrar').on('click',function(){ limpia(); });
    $('#tabla-registros').on('click','.btn-editar',function(){ limpia(); });

	//------------------------------------------------FUNCION PARA LLENAR DATATABLE-------------------------------

	function llenarTabla(){
		$("#loader").show();
		window.tablaAreas.clear().draw();

		$.ajax({
			url:		'ws/documentos/areas',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){		
			if( data.result ){ 	
				contador = 0;		
				$.each(data.records, function(index,value){
					estado = (value.estado==1?"<span class=\"label label-success\">Activo</span>":"<span class=\"label label-danger\">Inactivo</span>");
					contador++;
					counter1 = contador;
					if (value.pais == 'CR')
						counter2 = 'Costa Rica';
					else
						counter2 = 'Guatemala';
					counter3 = value.sociedad;
					counter4 = value.nombre;
					counter5 = value.descripcion;
					counter6 = estado;

					if (value.estado==1 ){			
						counter7 = '<a class="btn-editar btn btn-info btn-xs" href="#modal-editar" title="Editar" data-toggle="modal" data-ideditar="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
							   	   '<a style="margin-left:5px;" class="btn-estado btn btn-danger btn-xs" title="Cambiar Estado" href="#modal-suspender" data-toggle="modal" data-idestado="'+value.id+'"><i class="fa fa-level-down"></i></a>';
					}
					else
						if(value.estado==0){
							counter7 = '<a class="btn-editar btn btn-info btn-xs" title="Editar" href="#modal-editar" data-toggle="modal" data-ideditar="'+value.id+'"><i class="fa fa-pencil"></i></a>'+
							   	   '<a style="margin-left:5px;" class="btn-estado btn btn-success btn-xs" title="Cambiar estado"  href="#modal-activar" data-toggle="modal" data-idestado="'+value.id+'"><i class="fa fa-level-up"></i></a>';
						}

					window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7]).draw(false);
				});
			}
		})
		.fail(function(err){
			console.log(err);
		})
		.always( function(){
			$("#loader").fadeOut();
		});		
	}

	//--------------------------------------------------SELECT 2 PARA SOCIEDADES--------------------------------

	function llenarSociedades(selector){
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/sociedades/lista',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{
				$(selector).find('option').remove().end();
				$(selector).append($("<option />").val('0').text('Seleccione una sociedad'));

				$.each(data.records.TI_SOC.item, function(index, value)
				{
					$(selector).append($("<option />").val(value.BUKRS).text(value.BUKRS+' - '+value.BUTXT));
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

	//-----------------------------------FUNCION PARA LLENAR CAMPOS DE EDICION----------------------------

	$("#tabla-registros").on('click','.btn-editar', function( e )
	{
		e.preventDefault();				
		ideditar = $(e.target).closest("a").data("ideditar");
	    $.ajax({
	        type: "GET",
	        url : 'ws/documentos/areas/'+ideditar,
	        success : function( result )
        	{ 
				if( result.result )
				{
		 			$("#form-editar #editSociedad").val(result.records.sociedad);
		 			if (result.records.pais == 'CR')
		 				$('#form-editar #editPais').val('Costa Rica');
		 			else
		 				$('#form-editar #editPais').val('Guatemala')
		            $("#form-editar #editNombre").val(result.records.nombre);
		            $("#form-editar #editDescripcion").val(result.records.descripcion);		            
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});
//----------------------------------------- FUNCION PARA ELIMINAR ----------------------------
	$("#tabla-registros").on('click', '.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("ideliminar");
	});
//----------------------------------------------- FUNCION PARA SUSPENDER ----------------------------
	$("#tabla-registros").on('click', '.btn-estado', function( e ){
		idestado = $(e.target).closest("a").data("idestado");
	});
//----------------------------------------------EVENTOS------------------------------------------

	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	$('#btn-inactivar').on('click', cambiarEstado);
	$('#btn-activar').on('click', cambiarEstado);

//------------------------------------------FUNCIONES CREAR --------------------------------------

	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			if ($('#sociedad').val()!=0){
				if ($('#pais').val()!=0) {				
					$.ajax(
					{
						type: 		'POST',
						url: 		'ws/documentos/areas',
						dataType: 	'json',
						data: 		$('#form-crear').serialize(),
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
								toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
							}
					});
				}else{
					toastr['warning']('Debe de seleccionar el país','País incompleto');
				}
			}else{
				toastr['warning']('Debe de seleccionar un sociedad y pais', 'Sociedad incompleta');
			} 
		}
	}
//------------------------------------------------------FUNCION ACTUALIZAR---------------------------------------
	function update( e )
	{
		
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/documentos/areas/'+ideditar,
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
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	}

//-----------------------------------------------------FUNCION ACTIVAR-------------------------------------
	function cambiarEstado( e )
	{
		e.preventDefault();
		$.ajax
		({
			type: 		'GET',
			url: 		'ws/documentos/areas/estado/'+idestado,
			success: function ( result )
			{
				if( result.result )
				{
					setTimeout( function(){ amigable(); }, 500);  						
					toastr['success'](result.message, 'Éxito')
			        $('#modal-suspender').modal('hide'); 
			        $('#modal-activar').modal('hide'); 
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
			},
			error: function ( result )
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}
//------------------------------------------------------FUNCION ELIMINAR---------------------------------------

function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	'ws/documentos/areas/'+ideliminar,
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

// ---------------------------------------------------- Validate (√) -------------------------------------------------

$("#form-crear #sociedad").validate(
	{
		rules: 
		{
			sociedad:{
				required: true,
				min: 1
			}
		},
		messages:
		{
			sociedad:{
				min: 'Este campo es obligatorio'
			}
		}
	});
});