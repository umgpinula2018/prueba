jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	selectSociedades();
	selectEditSociedades();

	$("#loader").show();
	setTimeout(function(){ $("#loader").fadeOut(); }, 1000);

	// Propiedades
	$('.enabled').css( "cursor" , "pointer" );
	$('.disabled').css( "cursor" , "pointer" );
	window.tabla= $('.datatable').dataTable(
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

	$("#loader").fadeOut();
	limpiar();

	function limpiar(){
		$('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#form-editar')[0].reset();
        $("#form-editar").validate().resetForm();

        $('#form-crear #nombre').removeClass('error');
        $('#form-crear #email').removeClass('error');
        $('#form-crear #idarea_e').removeClass('error');
        $('#form-crear #sociedades').removeClass('error');
        $('#form-crear #cecos').removeClass('error');
        $('#form-crear #cuenta_mayor').removeClass('error');

        $('#form-editar #nombre').removeClass('error');
        $('#form-editar #email').removeClass('error');
        $('#form-editar #idarea_e').removeClass('error');
        $('#form-editar #sociedades').removeClass('error');
        $('#form-editar #cecos').removeClass('error');
        $('#form-editar #cuenta_mayor').removeClass('error');

        $('#form-crear #nombre').removeClass('valid');
        $('#form-crear #email').removeClass('valid');
        $('#form-crear #idarea_e').removeClass('valid');
        $('#form-crear #sociedades').removeClass('valid');
        $('#form-crear #cecos').removeClass('valid');
        $('#form-crear #cuenta_mayor').removeClass('valid');

        $('#form-editar #nombre').removeClass('valid');
        $('#form-editar #email').removeClass('valid');
        $('#form-editar #idarea_e').removeClass('valid');
        $('#form-editar #sociedades').removeClass('valid');
        $('#form-editar #cecos').removeClass('valid');
        $('#form-editar #cuenta_mayor').removeClass('valid');
      
        $('#form-crear #idarea_e').val(0);
        $('#form-crear #sociedades').val(0).trigger("change")
        $('#form-crear #cecos').val(0);
        // $('#form-crear #idarea').val(0);
        // $('#form-crear #sociedades').val(0).trigger("change")
        // $('#form-crear #cecos').val(0);
	}

	$('#btn-nuevo').on('click', function(){;
		limpiar();
	});

//--------------------------------------------SELECT AREAS-------------------------------------------
	function selectSociedades(){
		$.ajax(
		{
			url: "ws/sociedades/lista",
			type: "GET",
			dataType: "json",
			success: function(data){
				if(data.result){
					sociedades = $("#form-crear #sociedades");
					sociedades.select2();
					sociedades.append( "<option value='0'>Seleccione una sociedad</option> " );
					$.each(data.records.TI_SOC.item, function(index, value)
					{
						sociedades.append( "<option value='"+value.BUKRS+"'>"+value.BUKRS+" - "+value.BUTXT+"</option> " );
					});
					sociedades.select2();
				}
			},
			error: function(){
				console.error("fallo");
			}
		});
	}

	function selectEditSociedades(){
		$.ajax(
		{
			url: "ws/sociedades/lista",
			type: "GET",
			dataType: "json",
			success: function(data){
				if(data.result){
					sociedades = $("#form-editar #sociedades");
					sociedades.select2();
					sociedades.append( "<option value='0'>Seleccione una sociedad</option> " );
					$.each(data.records.TI_SOC.item, function(index, value)
					{
						sociedades.append( "<option value='"+value.BUKRS+"'>"+value.BUKRS+" - "+value.BUTXT+"</option> " );
					});
					sociedades.select2();
				}
			},
			error: function(){
				console.error("fallo");
			}
		});
	}

	$('#form-crear #sociedades').change(function(){
		sociedad = $('#sociedades').val();
		$.ajax(
		{
			url: "ws/parametros/sociedad/cecos",
			type: "GET",
			dataType: "json",
			data: { sociedad : sociedad },
			success: function(data){
				if(data.result && data.records){
					cecos = $("#form-crear #cecos");
					cecos.select2();
					$(cecos).find('option').remove().end();
					cecos.append( "<option value='0'>Seleccione una CECO</option> " );
					$.each(data.records, function(index, value)
					{
						cecos.append( "<option value='"+value.ZCECO+"'>"+value.ZCECO+" - "+value.ZDES+"</option> " );
					});
					cecos.select2();
				}else{
					console.log('No se obtuvó resultados');
				}
			},
			error: function(){
				console.error("fallo");
			}
		});
	});

	$('#form-editar #sociedades').change(function(){
		sociedad = $('#form-editar #sociedades').val();
		$.ajax(
		{
			url: "ws/parametros/sociedad/cecos",
			type: "GET",
			dataType: "json",
			data: { sociedad : sociedad },
			success: function(data){
				if(data.result){
					cecos = $("#form-editar #cecos");
					cecos.select2();
					$(cecos).find('option').remove().end();
					cecos.append( "<option value='0'>Seleccione una CECO</option> " );
					$.each(data.records, function(index, value)
					{
						cecos.append( "<option value='"+value.ZCECO+"'>"+value.ZCECO+" - "+value.ZDES+"</option> " );
					});
					cecos.select2();
				}
				console.log("termino");
			},
			error: function(){
				console.error("fallo");
			}
		});
	});


	//Eventos
	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	$('.enabled').on('click', habilitar);
	$('.disabled').on('click', deshabilitar);

	function habilitar( e )
	{
		e.preventDefault();
		id = $(e.target).closest('span').data('idregistro');
		$.ajax(
		{
			type: 	"PUT",
			url: 	"ws/donaciones/aprobadores/"+id,
			data: 	{ activo : 1 },
			success: function( result )
			{
				if( result.result )
				{
					setTimeout( function(){ amigable(); }, 500);  						
					toastr['info']('Ha sido habilitado el aproabdor', 'Información');
				}
				else
				{
					toastr['error']( result.message , 'Error');
				}
			},
			error: function( result )
			{
				console.log( result );
				toastr['error']( 'Ocurrio un problema al consultar los datos', 'Error');
			}	
		});
	}
	
	function deshabilitar( e )
	{
		e.preventDefault();
		id = $(e.target).closest('span').data('idregistro');
		$.ajax(
		{
			type: 	"PUT",
			url: 	"ws/donaciones/aprobadores/"+id,
			data: 	{ activo : 0 },
			success: function( result )
			{
				if( result.result )
				{
					setTimeout( function(){ amigable(); }, 500);  						
					toastr['info']('Ha sido deshabilitado el aprobador', 'Información');
				}
				else
				{
					toastr['error']( result.message , 'Error');
				}
			},
			error: function( result )
			{
				console.log( result );
				toastr['error']( 'Ocurrio un problema al consultar los datos', 'Error');
			}	
		});
	}

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		limpiar();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/donaciones/aprobadores/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #nombre").val(result.records.nombre);
		            $("#form-editar #usuario").val(result.records.usuario);
		            $("#form-editar #sociedades").val(result.records.sociedad).trigger("change");
		            setTimeout(cambiar_ceco,2000);
		            function cambiar_ceco(){
		            	$("#form-editar #cecos").val(result.records.ceco).trigger("change");
		            }
		            $("#form-editar #cuenta_mayor").val(result.records.cuenta);
		            $("#form-editar #idarea_e").val(result.records.tipo);
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

	//Funciones
	function store( e )
	{
		e.preventDefault();
		var datos = $('#form-crear').serialize();
		if( $( '#form-crear' ).valid() ){
			if ($('#idarea').val() != 0 && $('#sociedades').val() != 0 && $('#cecos').val() != 0 ) {
				$.ajax(
				{
					type: 		'POST',
					url: 		'ws/donaciones/aprobadores',
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
							toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
						}
				});
			}else{
				toastr['error']('Campos incompletos, Todo los campos son obligatorios', 'Error');
			}
		}
	}

	function update( e )
	{
		e.preventDefault();
		console.log($('#form-editar #sociedades').val());
		if ($('#form-editar #idarea_e').val() == 0 ) {
			$('#form-editar #idarea_e').removeClass('valid');
			$('#form-editar #idarea_e').addClass('error');
			toastr['error']('Debe seleccionar un área válida', 'Error');
		}
		else if ($('#form-editar #sociedades').val() == 0 ) {
			$('#form-editar #sociedades').removeClass('valid');
			$('#form-editar #sociedades').addClass('error');
			toastr['error']('Debe seleccionar una sociedad válida', 'Error');
		}
		else if ($('#form-editar #cecos').val() == 0 ) {
			$('#form-editar #cecos').removeClass('valid');
			$('#form-editar #cecos').addClass('error');
			toastr['error']('Debe seleccionar un ceco válido', 'Error');
		}
		else{
			if( $('#form-editar').valid() )
			{
				var datos = $('#form-editar').serialize();
				$.ajax
				({
					type: 		'PUT',
					url: 		'ws/donaciones/aprobadores/'+idregistro,
					dataType: 	'json',
					data: 		datos,
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
			url:	"ws/donaciones/aprobadores/"+ideliminar,
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

	$.validator.addMethod("valueNotEquals", function(value, element, arg){
  		return arg != value;
 	}, "Value must not equal arg.");

	$('#form-crear').validate(
	{
		rules:
		{
			sociedades:{valueNotEquals: "default"},
			cecos:{valueNotEquals: "default"}
		},
		messages:
		{
			sociedades:{
				 valueNotEquals: "Por favor, debe de seleccionar una sociedad", 
			},
			cecos:{
				 valueNotEquals: "Por favor, debe de seleccionar una ceco",
			},
		}
	});
});