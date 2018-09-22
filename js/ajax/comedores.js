jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var idcomedor  = 0;
	var idcomedormenu = 0;
	var subio = false;

	//Propiedades
	window.tabla= $('#tabla-registros').dataTable(
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

	$('.minimal-editor').summernote(
	{
		toolbar: [
		    ['style', ['bold', 'italic', 'underline']],	
		    ['fontsize', ['fontsize']],
		    ['color', ['color']],
		    ['para', ['ul', 'ol', 'paragraph']]
	  	]
	});

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

	//Eventos
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	$('#loader').hide();
	//Funciones
	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/comedores',
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
		}
	}

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/comedores/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #descripcion").val(result.records[0].descripcion);
		            $("#form-editar #direccion").val(result.records[0].direccion);
		            $("#form-editar #latitud").val(result.records[0].latitud);
		            $("#form-editar #longitud").val(result.records[0].longitud);
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

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/comedores/'+idregistro,
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

	$("#tabla-registros").on('click', 'a.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("idregistro");
	});

	function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	"ws/comedores/"+ideliminar,
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

	$("#tabla-registros").on('click', 'a.btn-menu', function( e ){
		idcomedor = $(e.target).closest("a").data("idregistro");
	});

	$('#btn-cargar').on('click', function( e )
	{
		e.preventDefault();
		if( $('#form-importar').valid() )
		{
		    $.ajax(
		    {
		        type: 			'POST',
		        dataType: 		'json',
		        url: 			'ws/comedores/cargarmenu',  
			    data: 			{ idcomedor:idcomedor, lunes:$('#lunes').code(), martes:$('#martes').code(), miercoles:$('#miercoles').code(), jueves:$('#jueves').code(), viernes:$('#viernes').code(), sabado:$('#sabado').code(), fechainicio:$('#fechainicio').val(), fechafin:$('#fechafin').val()  },
		        success: function( result )
			        {
			        	if( result.result )
			        	{
				        	toastr['success']( result.message , 'Éxito' );
							setTimeout( function(){ amigable(); }, 500);
							$('#modal-menu').modal('hide');
						}
						else
						{
							toastr['error']( result.message , 'Espera' );
						}
			        },
		        error: function( e )
			        {
						toastr[ 'error' ]( 'Ocurrió un problema, intenta de nuevo' , 'Error' );
			        }		        
		    });
		}
	});

	$("#tabla-registros").on('click','a.btn-editmenu', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
		$("#form-editarmenu #descripcion").val('');
        $("#form-editarmenu #fechainicio").val('');
	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/comedoresmenu?idcomedor="+idregistro,
	        success : function( result )
        	{		
				if( result.result )
				{
					if(result.records.length > 0)
					{
			            $("#form-editarmenu #fechainicio").val(result.records[0].fecha_inicio);
			            $("#form-editarmenu #fechafin").val(result.records[0].fecha_fin);
			            $("#form-editarmenu #idreg").val(result.records[0].id);
			            $('#form-editarmenu #div-lunes').find('.note-editor').find('.note-editable').html(result.records[0].imagen_lunes);
			            $('#form-editarmenu #div-martes').find('.note-editor').find('.note-editable').html(result.records[0].imagen_martes);
			            $('#form-editarmenu #div-miercoles').find('.note-editor').find('.note-editable').html(result.records[0].imagen_miercoles);
			            $('#form-editarmenu #div-jueves').find('.note-editor').find('.note-editable').html(result.records[0].imagen_jueves);
			            $('#form-editarmenu #div-viernes').find('.note-editor').find('.note-editable').html(result.records[0].imagen_viernes);
			            $('#form-editarmenu #div-sabado').find('.note-editor').find('.note-editable').html(result.records[0].imagen_sabado);
			        }
			        else
			        {
			        	$("#form-editarmenu #fechainicio").val('');
			            $("#form-editarmenu #fechafin").val('');
			            $('#form-editarmenu #div-lunes').find('.note-editor').find('.note-editable').html('');
			            $('#form-editarmenu #div-martes').find('.note-editor').find('.note-editable').html('');
			            $('#form-editarmenu #div-miercoles').find('.note-editor').find('.note-editable').html('');
			            $('#form-editarmenu #div-jueves').find('.note-editor').find('.note-editable').html('');
			            $('#form-editarmenu #div-viernes').find('.note-editor').find('.note-editable').html('');
			            $('#form-editarmenu #div-sabado').find('.note-editor').find('.note-editable').html('');
						toastr['error']('No existen menús cargados para la semana actual en este comedor', 'Error');
			        }
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

	$('#btn-editmenu').on('click', function( e )
	{
		e.preventDefault();
		if( $('#form-importar').valid() )
		{
		    $.ajax(
		    {
		        type: 			'POST',
		        dataType: 		'json',
		        url: 			'ws/comedores/actualizarmenu',  
			    data: 			{ idregistro:$('#idreg').val(), lunes:$('#lunes_e').code(), martes:$('#martes_e').code(), miercoles:$('#miercoles_e').code(), jueves:$('#jueves_e').code(), viernes:$('#viernes_e').code(), sabado:$('#sabado_e').code(), fechainicio:$('#fechainicio').val(), fechafin:$('#fechafin').val()  },
		        success: function( result )
			        {
			        	if( result.result )
			        	{
				        	toastr['success']( result.message , 'Éxito' );
							setTimeout( function(){ amigable(); }, 500);
							$('#modal-editmenu').modal('hide');
						}
						else
						{
							toastr['error']( result.message , 'Espera' );
							setTimeout( function(){ amigable(); }, 500);
							$('#modal-editmenu').modal('hide');
						}
			        },
		        error: function( e )
			        {
						toastr[ 'error' ]( 'Ocurrió un problema, intenta de nuevo' , 'Error' );
			        }		        
		    });
		}
	});

});