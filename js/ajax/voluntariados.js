jQuery( document ).ready( function( $ )
{	
	jQuery("#loader").fadeOut();
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;
	var subio2	   = false;
	var subio3	   = false;
	var otroEdit   = '';

	llenarGruposCecos('#grupos_cecos');
	llenarSociedades('#form-duplicar #duplicado_sociedad');
	llenarCecos     ('#form-duplicar #duplicado_ceco');
	llenarUens      ('#form-duplicar #duplicado_uen');
	llenarGruposCecos('#form-duplicar #duplicado_grupos_cecos');

	llenarSociedades('#form-editar #edit_sociedad');
	llenarCecos     ('#form-editar #edit_ceco');
	llenarUens      ('#form-editar #edit_uen');
	llenarGruposCecos('#form-editar #edit_grupos_cecos');



	// Limpiar Formularios 
	function limpiar (){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();

        $('#descripcion') .removeClass('error');
        $('#informacion') .removeClass('error');
        $('#idsociedad')  .removeClass('error');
        $('#idceco')      .removeClass('error');
        $('#iduen')       .removeClass('error');
        $('#idaprob')     .removeClass('error');
        $('#fecha')       .removeClass('error');
        $('#hora_inicio') .removeClass('error');
        $('#hora_fin')    .removeClass('error');
        $('#valor')       .removeClass('error');
        $('#espacios')    .removeClass('error');
        $('#detalle')     .removeClass('error');
        $('#idtipov')     .removeClass('error');
        $('#idcateg')     .removeClass('error');

        $('#descripcion') .removeClass('valid');
        $('#informacion') .removeClass('valid');
        $('#idsociedad')  .removeClass('valid');
        $('#idceco')      .removeClass('valid');
        $('#iduen')       .removeClass('valid');
        $('#idaprob')     .removeClass('valid');
        $('#fecha')       .removeClass('valid');
        $('#hora_inicio') .removeClass('valid');
        $('#hora_fin')    .removeClass('valid');
        $('#valor')       .removeClass('valid');
        $('#espacios')    .removeClass('valid');
        $('#detalle')     .removeClass('valid');
        $('#idtipov')     .removeClass('valid');
        $('#idcateg')     .removeClass('valid');

    }
    $('#crearRegistro').on('click',function(){
       limpiar();
    });

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    $('.chosen-select').chosen({ 'search_contains': true, 'width': '100%', 'white-space': 'nowrap', 'allow_single_deselect': true, 'disable_search_threshold':10});
	$('.timepicker').timepicker({orientation: 'b', showMeridian: false});

	function llenarSociedades(selector)
	{
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
				$.each(data.records.TI_SOC.item, function( index, value )
				{
					$(selector).append($("<option />").val(value.BUKRS).text(value.BUKRS+' - '+value.BUTXT+' - '+value.LAND1));
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

	function llenarUens(selector)
	{
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/listauen',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$.each(data.records.UENS.item, function( index, value )
				{
					$(selector).append($("<option />").val(value.OBJID).text(value.OBJID+' - '+value.MC_SEARK));
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

    function llenarGruposCecos(selector)
    {
        $.ajax(
            {
                type: 		'GET',
                url: 		'ws/voluntariados/grupos/cecos',
                dataType: 	'json',
            })
            .done(function( data )
            {
                if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $.each(data.records, function( index, value )
                    {
                        $(selector).append($("<option />").val(value.id).text(value.nombre));
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

	window.tabla = $('.datatable').dataTable(
	{
		"aaSorting": [[ 0, "desc" ]],
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

	//Eventos
	$('#btn-crear').on('click',store);
	$('#btn-duplicar').on('click', duplicar);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);
	$('#otros').on('change',otros);
	$('#otros_edit').on('change',otros_edit);
	$('#btn-cerrar-espacios').on('click', cerrar);

	//Funciones
	$('#cerrar-int').on('click', function(e){
		e.preventDefault();
		console.log( 'se cerraron los integrantes' );
		setTimeout( function(){ amigable(); }, 500);
	});

	$("#tabla-registros").on('click','a.btn-exportar', function( e )
	{
		e.preventDefault();
		var idregistro = $(this).data("idregistro");
		window.location.href = "ws/voluntariados/exportar/"+idregistro;
        toastr["success"]("Exportado correctamente", "Éxito");
	});
 // ---------------------------------------- Tabla de Voluntariados ------------------------------------------------------------------------
	$("#tabla-registros").on('click', 'a.btn-integrantes', function ver_integrantes( e ){
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
		$('.listado_integrantes_').remove();
		$('.listado_integrantess_').remove();
		
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/voluntariados/integrantes/'+idregistro,
			dataType: 	'json',
			success: function( result )
				{
					if( result.result )
					{
						var contar=0;
						var espacio='';
						$.each(result.records[0], function( index, value )
						{
			            	contar=contar+1;
			            	if( contar>1 )
		            		{
		            			espacio='<div class="col-sm-12">'+
				                        '<div class="form-group">'+
										    '<hr>'+
				                        '</div>'+
				                    '</div>';
			            	}
			            	var confirmacion="";
			            	if( value.confirmaremail== 1 )
			            		confirmacion='<span>Si</span>';
			            	else
			            		confirmacion='<span>No</span>';

			            	$('#listado_integrantes').append('<div id="div_integrantes_'+index+'" class="col-sm-12 listado_integrantes_">'+
											                    '<div class="row">'+ espacio +
											                        '<div class="form-group col-sm-12">'+
																	    '<label class="col-sm-12"><strong>Solicitante</strong> '+value.empleado+'</label>'+
																	    '<label class="col-sm-12"><strong>Departamento</strong> '+value.depto_empleado+'</label>'+
																	    '<label class="col-sm-12"><strong>#Emp</strong> '+value.pern_empleado+'</label>'+
																	    '<label class="col-sm-8"><strong>Confirmacion de correo</strong> '+confirmacion+'</label><br>'+
																	    '<button data-id="'+value.id+'" data-index="'+index+'" class="btn btn-abrir btn-warning btn-sm " aria-hidden="true"><i class="fa fa-user-times "></i> <span id="preguntar_'+index+'">Descartar</span></button>'+
											                        '</div>'+
											                    '</div>'+
			            									'</div>');
						});
						if(contar==0)
						{
							$('#listado_integrantes').append('<h3 class="col-sm-12 listado_integrantess_"><center>No hay integrantes para el voluntariado</center></h3>');
						}
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
		$('#loader').fadeOut();
	});

	// ------------------------------------------------ Tabla de integrantres ----------------------------------------------------------------------

	$("#listado_integrantes").on('click', '.btn-abrir', function( e ){
		e.preventDefault();
		var index = $(this).data("index");
		var id = $(this).data("id");
		if( $('#preguntar_'+index).text() == 'Descartar' ){
			$('#preguntar_'+index).text('Confirma la eliminación');
			$(this).removeClass('btn-warning');
			$(this).addClass('btn-danger');
		}
		else {

			$('#loader').show();
			$.ajax(
			{
				type: 		'GET',
				url: 		'ws/voluntariados/espacios/liberar/'+id,
				dataType: 	'json',
				success: function( result )
					{
						if( result.result )
						{
							var i=0;
							$('#div_integrantes_'+index).fadeOut().remove();
							toastr['success']('Se dio de baja al aprticipante', 'Éxito')
							$('.listado_integrantes_').each(function(){
								if($(this))
								{
									i=i+1;
								}
							});
							if( i == 0 )
							{
								$('#listado_integrantes').append('<h3 class="col-sm-12 listado_integrantess_"><center>No hay integrantes para el voluntariado</center></h3>');
							} 
						}
						else
						{
							toastr['error'](result.message, 'Error');
						}
						$('#loader').fadeOut();
					},
				error: 	function( result )
					{
						toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
						$('#loader').fadeOut();
					}
			});
		}

		
	});

	$("#tabla-registros").on('click', 'a.btn-cerrar', function( e ){
		idregistro = $(e.target).closest("a").data("idregistro");
	});

	function cerrar( e ){
		e.preventDefault();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/voluntariados/espacios/cerrar/'+idregistro,
			dataType: 	'json',
			success: function( result )
				{
					if( result.result )
					{
						$('#modal-cerrar').modal('hide');
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
		$('#loader').fadeOut();
	}

	function otros( e ){
			e.preventDefault();
			if( $('#otros').prop('checked') ) {
			    $('#otro').attr('type','text');
			    $('#otro').attr('placeholder','Otro');
			    $('#otro').val('');
			    $('#otross').text('');
			} else {
				console.log( 'No seleccionado' );
			    $('#otro').val('');
			    $('#otro').attr('placeholder','Otro');
				$('#otro').attr('type','hidden');
			    $('#otross').text(' Otros');
			}
	}

	function otros_edit( e ){
			e.preventDefault();
			if( $('#otros_edit').prop('checked') ) {
				console.log( 'Seleccionado' );
			    $('#otro_edit').attr('type','text');
			    $('#otro_edit').attr('placeholder','Otro');
			    $('#otro_edit').val(otroEdit);
			    $('#otross_edit').text('');
			} else {
				console.log( 'No seleccionado' );
			    $('#otro_edit').val('');
			    $('#otro_edit').attr('placeholder','Otro');
				$('#otro_edit').attr('type','hidden');
			    $('#otross_edit').text(' Otros');
			}
	}

	// ------------------------------------------------------ Crear un Voluntariado ----------------------------------------------------

	function store( e )	{
				
		if( !subio2 )
		{
			if( $('#form-crear').valid() )
			{
				subio2 = true;
				var sociedades = $('#idsociedad').val()   != null ? $('#idsociedad').val() : [];
				var ceco 	   = $('#idceco').val()       != null ? $('#idceco').val() : [];
				var grupos     = $('#grupos_cecos').val() != null ? $('#grupos_cecos').val() : [];
				var uen        = $('#iduen').val()        != null ? $('#iduen').val() : [];
				
				var detail = [];
				
				$('.detail').each( function(){
					var string = $(this).val();
					if (string){
						detail.push(string);
					}
				});
				
				if(sociedades.length > 0 && ceco.length == 0 && uen.length == 0 && grupos.length == 0){
					if( $('#idtipov').val() > 0 )
					{
						if( $( '#form-crear' ).valid() )
						{
							$('#loader').show();
							var datos = new FormData( $('#form-crear')[0] );
							var sociedad = $('#idsociedad').val().join();
							datos.append('sociedades', sociedad);
							datos.append('fechas', detail);
							
							$.ajax(
							{
								type: 		'POST',
								url: 		'ws/voluntariados',
								dataType: 	'json',
								contentType: false,
						        processData: false,
								cache: 		 false,
								data: 		datos,
								success: function( result )
									{
										if( result.result )
										{
											$('#modal-crear').modal('hide');
											toastr['success'](result.message, 'Éxito');
											setTimeout( function(){ amigable(); }, 500); 
											$('#loader').fadeOut(); 
										}
										else
										{
											subio2 = false; 
											toastr['error'](result.message, 'Error');
											$('#loader').fadeOut();
										}
									},
								error: 	function( result )
									{
										toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
										$('#loader').fadeOut();
									}
							});
							
						}
						else
						{
							subio2 = false;
						}
					}
					else
					{
						subio2 = false;
						toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
					}
				}
				else if( ceco.length > 0 && sociedades.length == 0 && uen.length == 0 && grupos.length == 0){
                    if( $('#idtipov').val() > 0 ) {
						
						$('#loader').show();
                        var datos  = new FormData( $('#form-crear')[0] );
                        var ceco   = $('#idceco').val().join();
						datos.append('ceco', ceco);
						datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 		'POST',
                                url: 		'ws/voluntariados',
                                dataType: 	'json',
                                contentType: false,
                                processData: false,
                                cache: 		 false,
                                data: 		datos,
                                success: function( result )
                                {
                                    if( result.result )
                                    {
                                        $('#modal-crear').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
                                        setTimeout( function(){ amigable(); }, 500);
                                        $('#loader').fadeOut();
                                    }
                                    else
                                    {
                                        subio2 = false;
                                        toastr['error'](result.message, 'Error');
                                        $('#loader').fadeOut();
                                    }
                                },
                                error: 	function( result )
                                {
                                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                    $('#loader').fadeOut();
                                }
                            });
                    }
                    else {
                        subio2 = false;
                        toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
                    }
                }
                else if( grupos.length > 0 && ceco.length == 0 && sociedades.length == 0 && uen.length == 0){
                    if( $('#idtipov').val() > 0 ) {
						
						$('#loader').show();
                        var datos  = new FormData( $('#form-crear')[0] );
                        var grupos = $('#grupos_cecos').val().join();
						datos.append('grupos_cecos', grupos);
						datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 		'POST',
                                url: 		'ws/voluntariados',
                                dataType: 	'json',
                                contentType: false,
                                processData: false,
                                cache: 		 false,
                                data: 		datos,
                                success: function( result )
                                {
                                    if( result.result )
                                    {
                                        $('#modal-crear').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
                                        setTimeout( function(){ amigable(); }, 500);
                                        $('#loader').fadeOut();
                                    }
                                    else
                                    {
                                        subio2 = false;
                                        toastr['error'](result.message, 'Error');
                                        $('#loader').fadeOut();
                                    }
                                },
                                error: 	function( result )
                                {
                                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                    $('#loader').fadeOut();
                                }
                            });
                    }
                    else {
                        subio2 = false;
                        toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
                    }
				}
                else if( uen.length > 0  && sociedades.length == 0 && ceco.length == 0 && grupos.length == 0){
                    if( $('#idtipov').val() > 0 )
                    {
						$('#loader').show();
                        var datos = new FormData( $('#form-crear')[0] );
                        var uen = $('#iduen').val().join();
						datos.append('uen', uen);
						datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 		'POST',
                                url: 		'ws/voluntariados',
                                dataType: 	'json',
                                contentType: false,
                                processData: false,
                                cache: 		 false,
                                data: 		datos,
                                success: function( result )
                                {
                                    if( result.result )
                                    {
                                        $('#modal-crear').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
										setTimeout( function(){ amigable(); }, 500);
										$('#loader').fadeOut();
                                    }
                                    else
                                    {
                                        subio2 = false;
										toastr['error'](result.message, 'Error');
										$('#loader').fadeOut();
                                    }
                                },
                                error: 	function( result )
                                {
									toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
									$('#loader').fadeOut();
                                }
                            });
                    }
                    else
                    {
                        subio2 = false;
                        toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
                    }
                }
				else {
					subio2 = false;
					toastr['warning']('Solo debe elegir un valor, CECO, UEN o Sociedad', 'Intente de nuevo');
				}
			} else {
                subio2 = false;
            }
		} else {
			subio2 = false;
			toastr['warning']( 'Registre el voluntariado, por seguridad en la carga de archivo registre el voluntariado nuevamente' , 'Intente de nuevo' );
		}
	}

	// ---------------------------------------------------- Mostrar datos de Duplicar Voluntariado -------------------------------------

	$("#tabla-registros").on('click','a.btn-duplicar', function( e )
	{

		idregistro = $(e.target).closest("a").data("idregistro");

	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/voluntariados/datosvoluntariado/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
                    var grupos = JSON.parse('['+result.records.grupo_cecos+']');

                    if(result.records.sociedad.length > 0){
                        $('#form-duplicar #duplicado_sociedad').removeAttr('disabled');
                        $('#form-duplicar #duplicado_ceco').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_uen').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_grupos_cecos').attr('disabled','disabled');
                    }
                    else if(result.records.ceco.length > 0){
                        $('#form-duplicar #duplicado_ceco').removeAttr('disabled');
                        $('#form-duplicar #duplicado_sociedad').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_uen').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_grupos_cecos').attr('disabled','disabled');
                    }
                    else if(result.records.uen.length > 0){
                        $('#form-duplicar #duplicado_uen').removeAttr('disabled');
                        $('#form-duplicar #duplicado_sociedad').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_ceco').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_grupos_cecos').attr('disabled','disabled');
                    }
                    else if(grupos.length > 0){
                        $('#form-duplicar #duplicado_grupos_cecos').removeAttr('disabled');
                        $('#form-duplicar #duplicado_sociedad').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_ceco').attr('disabled','disabled');
                        $('#form-duplicar #duplicado_uen').attr('disabled','disabled');
                    }
                    else {
                        $('#form-duplicar #duplicado_uen').removeAttr('disabled');
                        $('#form-duplicar #duplicado_ceco').removeAttr('disabled');
                        $('#form-duplicar #duplicado_sociedad').removeAttr('disabled');
                        $('#form-duplicar #duplicado_grupos_cecos').removeAttr('disabled');
                    }

		            $("#form-duplicar #descripcion_d").val(result.records.descripcion);
		            $('#form-duplicar #duplicado_ceco')    .val(result.records.ceco).trigger("change");
		            $('#form-duplicar #duplicado_sociedad').val(result.records.sociedad).trigger("change");
		            $('#form-duplicar #duplicado_uen')     .val(result.records.uen).trigger("change");
		            $('#form-duplicar #duplicado_grupos_cecos').val(grupos).trigger("change");
		            $("#form-duplicar #ubicacion_d").val(result.records.ubicacion);
		            $("#form-duplicar #fecha_d")      .val(result.records.fecha);
		            $("#form-duplicar #hora_inicio_d").val(result.records.hora_inicio);
		            $("#form-duplicar #hora_fin_d")   .val(result.records.hora_fin);
		            $("#form-duplicar #espacios_d")   .val(result.records.espacios);
		            $("#form-duplicar #valor_d")      .val(result.records.valor_horas);
		            $("#form-duplicar #idaprob_d")    .val(result.records.usuario_aprob);
		            $("#form-duplicar #idtipov_d")    .val(result.records.tipo_voluntariado);
		            $("#form-duplicar #detalle_d")    .val(result.records.detalle);
		            result.records.carga_masiva == 1 ? $("#form-duplicar #carga_masiva_d").attr('checked', 'checked') : $("#form-duplicar #carga_masiva_d").removeAttr('checked', 'checked');
		            result.records.huella       == 1 ? $("#form-duplicar #huella_d").attr('checked', 'checked') : $("#form-duplicar #huella_d").removeAttr('checked', 'checked');
		            result.records.hora_laboral == 1 ? $("#form-duplicar #hora_laboral_d").attr('checked', 'checked') : $("#form-duplicar #hora_laboral_d").removeAttr('checked', 'checked');
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

	// ------------------------------------------------------ Duplicar Voluntariado ----------------------------------------------------

	function duplicar( e ){
		e.preventDefault();
		if( !subio3 ) {
			subio3 = true;
			var sociedades = $('#duplicado_sociedad').val() != null ? $('#duplicado_sociedad').val() : [];
			var ceco       = $('#duplicado_ceco').val()     != null ? $('#duplicado_ceco').val() : [];
			var uen        = $('#duplicado_uen').val()      != null ? $('#duplicado_uen').val() : [];
			var grupos     = $('#duplicado_grupos_cecos').val()      != null ? $('#duplicado_grupos_cecos').val() : [];

            var detail = [];

            $('.detail').each( function(){
                var string = $(this).val();
                if (string){
                    detail.push(string);
                }
            });

			if( sociedades.length > 0 && ceco.length == 0 && uen.length == 0 )
			{
				if( $('#idtipov_d').val() > 0 )
				{
					if( $( '#form-duplicar' ).valid() )
					{
						$('#loader').show();
						var datos = new FormData( $('#form-duplicar')[0] );
						var sociedad = $('#duplicado_sociedad').val().join();
						datos.append('sociedades', sociedad);
                        datos.append('fechas', detail);

						$.ajax(
						{
							type: 		'POST',
							url: 		'ws/voluntariados',
							dataType: 	'json',
							contentType: false,
					        processData: false,
							cache: 		 false,
							data: 		datos,
							success: function( result )
								{
									if( result.result )
									{
										$('#modal-duplicar').modal('hide');
										toastr['success'](result.message, 'Éxito');
										setTimeout( function(){ amigable(); }, 500);
										$('#loader').fadeOut();  
									}
									else
									{
										toastr['error'](result.message, 'Error');
										$('#loader').fadeOut();
									}
								},
							error: 	function( result )
								{
									toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
									$('#loader').fadeOut();
								}
						});
					}
					else
					{
						subio3 = false;
					}
				}
				else
					toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
			}
			else if( ceco.length > 0 && sociedades.length == 0 && uen.length == 0 )
            {
                if( $('#idtipov_d').val() > 0 )
                {
                    if( $( '#form-duplicar' ).valid() )
                    {
						$('#loader').show();
                        var datos = new FormData( $('#form-duplicar')[0] );
                        var ceco = $('#duplicado_ceco').val().join();
                        datos.append('ceco', ceco);
                        datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 		'POST',
                                url: 		'ws/voluntariados',
                                dataType: 	'json',
                                contentType: false,
                                processData: false,
                                cache: 		 false,
                                data: 		datos,
                                success: function( result )
                                {
                                    if( result.result )
                                    {
                                        $('#modal-duplicar').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
										setTimeout( function(){ amigable(); }, 500);
										$('#loader').fadeOut();
                                    }
                                    else
                                    {
										toastr['error'](result.message, 'Error');
										$('#loader').fadeOut();
                                    }
                                },
                                error: 	function( result )
                                {
									toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
									$('#loader').fadeOut();
                                }
                            });
                    }
                    else
                    {
                        subio3 = false;
                    }

                }
                else
                    toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
            }
            else if( uen.length > 0  && sociedades.length == 0 && ceco.length == 0)
            {
                if ($('#idtipov_d').val() > 0) {
                    if ($('#form-duplicar').valid()) {
						
						$('#loader').show();
                        var datos = new FormData($('#form-duplicar')[0]);
                        var uen = $('#duplicado_ceco').val().join();
                        datos.append('uen', uen);
                        datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 'POST',
                                url: 'ws/voluntariados',
                                dataType: 'json',
                                contentType: false,
                                processData: false,
                                cache: false,
                                data: datos,
                                success: function (result) {
                                    if (result.result) {
                                        $('#modal-duplicar').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
                                        setTimeout(function () { amigable();}, 500);
										$('#loader').fadeOut();
                                    }
                                    else {
										toastr['error'](result.message, 'Error');
										$('#loader').fadeOut();
                                    }
                                },
                                error: function (result) {
									toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
									$('#loader').fadeOut();
                                }
                            });
                    }
                    else {
                        subio3 = false;
                    }
                }
                else
                    toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
            }
            else if( grupos.length > 0 && ceco.length == 0 && sociedades.length == 0 && uen.length == 0)
            {
                if ($('#idtipov_d').val() > 0) {
                    if ($('#form-duplicar').valid()) {
						
						$('#loader').show();
                        var datos = new FormData($('#form-duplicar')[0]);
                        datos.append('grupos_cecos', grupos);
                        datos.append('fechas', detail);

                        $.ajax(
                            {
                                type: 'POST',
                                url: 'ws/voluntariados',
                                dataType: 'json',
                                contentType: false,
                                processData: false,
                                cache: false,
                                data: datos,
                                success: function (result) {
                                    if (result.result) {
                                        $('#modal-duplicar').modal('hide');
                                        toastr['success'](result.message, 'Éxito');
										setTimeout( function(){ amigable(); }, 500);
										$('#loader').fadeOut();
                                    }
                                    else {
                                        subio2 = false;
                                        toastr['error'](result.message, 'Error');
                                        $('#loader').fadeOut();
                                    }
                                },
                                error: function (result) {
                                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                    $('#loader').fadeOut();
                                }
                            });
                    }else {
                        subio3 = false;
                    }
                } else {
                    subio2 = false;
                    toastr['error']('Debe elegir un tipo de voluntariado', 'Error');
                }
            }
            else {

                toastr['error']('Solo debe elegir un valor, CECO, UEN o Sociedad', 'Error');

            }
		} else {
			subio3 = false;
			toastr['warning']( 'Actualice la página, por seguridad solo se permite subir un archivo a la vez' , 'Espere' );
		}
	}

	//---------------------------------------------- Mostrar datos para Editar Voluntariado --------------------------------------------

	$("#tabla-registros").on('click','a.btn-editar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/datosvoluntariado/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
                    var grupos = JSON.parse('['+result.records.grupo_cecos+']');

					if(result.records.sociedad.length > 0){
						$('#form-editar #edit_sociedad').removeAttr('disabled');
						$('#form-editar #edit_ceco').attr('disabled','disabled');
						$('#form-editar #edit_uen').attr('disabled','disabled');
						$('#form-editar #edit_grupos_cecos').attr('disabled','disabled');
					}
					else if(result.records.ceco.length > 0){
						$('#form-editar #edit_ceco').removeAttr('disabled');
						$('#form-editar #edit_sociedad').attr('disabled','disabled');
						$('#form-editar #edit_uen').attr('disabled','disabled');
                        $('#form-editar #edit_grupos_cecos').attr('disabled','disabled');
					}
					else if(result.records.uen.length > 0){
						$('#form-editar #edit_uen').removeAttr('disabled');
						$('#form-editar #edit_sociedad').attr('disabled','disabled');
						$('#form-editar #edit_ceco').attr('disabled','disabled');
                        $('#form-editar #edit_grupos_cecos').attr('disabled','disabled');
					}
					else if(grupos.length > 0){
                        $('#form-editar #edit_grupos_cecos').removeAttr('disabled');
                        $('#form-editar #edit_sociedad').attr('disabled','disabled');
                        $('#form-editar #edit_ceco').attr('disabled','disabled');
                        $('#form-editar #edit_uen').attr('disabled','disabled');
					}
					else {
                        $('#form-editar #edit_uen').removeAttr('disabled');
                        $('#form-editar #edit_ceco').removeAttr('disabled');
                        $('#form-editar #edit_sociedad').removeAttr('disabled');
                        $('#form-editar #edit_grupos_cecos').removeAttr('disabled');
					}

		            $("#form-editar #descripcion_edit") .val(result.records.descripcion);
		            $("#form-editar #ubicacion_edit")   .val(result.records.ubicacion);
		            $('#form-editar #edit_ceco')        .val(result.records.ceco).trigger("change");
		            $('#form-editar #edit_sociedad')    .val(result.records.sociedad).trigger("change");
		            $('#form-editar #edit_uen')         .val(result.records.uen).trigger("change");
		            $('#form-editar #edit_grupos_cecos').val(JSON.parse('['+result.records.grupo_cecos+']')).trigger("change");
		            $("#form-editar #fecha_edit")       .val(result.records.fecha);
		            $("#form-editar #hora_inicio_edit") .val(result.records.hora_inicio);
		            $("#form-editar #hora_fin_edit")    .val(result.records.hora_fin);
		            $("#form-editar #espacios_edit")    .val(result.records.espacios);
		            $("#form-editar #valor_edit")       .val(result.records.valor_horas);
		            $("#form-editar #idtipov_edit").val(result.records.tipo_voluntariado);
		            $("#form-editar #idcateg_edit").val(result.records.categoria_voluntariado);
		            $("#form-editar #detalle_edit").val(result.records.detalle);
		            result.records.carga_masiva == 1 ? $("#form-editar #carga_masiva_edit").attr('checked', 'checked') : $("#form-duplicar #carga_masiva_d").removeAttr('checked', 'checked');
		            result.records.huella       == 1 ? $("#form-editar #huella_edit").attr('checked', 'checked') : $("#form-duplicar #huella_d").removeAttr('checked', 'checked');
		            result.records.hora_laboral == 1 ? $("#form-editar #hora_laboral_edit").attr('checked', 'checked') : $("#form-duplicar #hora_laboral_d").removeAttr('checked', 'checked');

					otroEdit = result.records.otro;
		            if( otroEdit ) {
					    $('#otro_edit').attr('type','text');
					    $('#otro_edit').attr('placeholder','Otro');
					    $('#otro_edit').val(otroEdit);
					    $('#otross_edit').text('');
					    $("#otros_edit").prop("checked", "checked");
					} else {
					    $('#otro_edit').val('');
					    $('#otro_edit').attr('placeholder','Otro');
						$('#otro_edit').attr('type','hidden');
					    $('#otross_edit').text(' Otros');
					    $("#otros_edit").prop("checked", "");
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

	// -------------------------------------------------- Editar un voluntariado -------------------------------------------------------

	function update( e ){
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			var hi = new Date('1/1/1990 '+$('#hora_inicio_edit').val());
			var hf = new Date('1/1/1990 '+$('#hora_fin_edit').val());
			var vh = ( ((hf - hi) / 1000) / 3600 );
			var datos;
			var sociedades = $('#edit_sociedad').val() != null ? $('#edit_sociedad').val().join() : [];
			var cecos = $('#edit_ceco').val()          != null ? $('#edit_ceco').val().join() : [];
			var uens  = $('#edit_uen').val()           != null ? $('#edit_uen').val().join() : [];
			var grupo = $('#edit_grupos_cecos').val()  != null ? $('#edit_grupos_cecos').val().join() : [];

			datos = $('#form-editar').serialize()+'&sociedad='+sociedades+'&ceco='+cecos+'&uen='+uens+'&grupo_cecos='+grupo;
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/voluntariados/'+idregistro,
				dataType: 	'json',
				data: 		datos+'&valor_horas='+vh,
				success: function ( result )
				{
					if( result.result )
					{
						setTimeout( function(){ amigable(); }, 500);  						
						toastr['success'](result.message, 'Éxito');
						
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


// --------------------------------------------------------- Eliminar Voluntariado ------------------------------------------------------
	$("#tabla-registros").on('click', 'a.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("idregistro");
	});

	function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	"ws/voluntariados/"+ideliminar,
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

	$('#crearRegistro').on('click', function( e )
	{
		e.preventDefault();
		$('#idusuario').val(localStorage.USUARIO.toUpperCase());

		$.ajax(
		{
	        type: 		"GET",
	        url : 		"ws/sociedades/lista",
	        dataType: 	"json",
	        success : function( result )
        	{
				if( result.result )
				{
					$.each(result.records.TI_SOC.item, function( index, value )
					{
		            	$("#form-crear #idsociedad").append("<option value='"+value.BUKRS+"'>"+value.BUKRS+" - "+ value.BUTXT+"</option>");
					});
					$("#form-crear #idsociedad").trigger("chosen:updated");
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});

		$.ajax(
		{
	        type: 		"GET",
	        url : 		"ws/cecos/lista",
	        dataType: 	"json",
	        success : function( result )
        	{
				if( result.result )
				{
					$.each(result.records.TI_CECO.item, function( index, value )
					{
		            	$("#form-crear #idceco").append("<option value='"+value.KOSTL+"'>"+value.LTEXT+' - '+value.KOSTL+"</option>");
					});
					$("#form-crear #idceco").trigger("chosen:updated");
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});

		$.ajax({
	        type: "GET",
	        url : "ws/listauen",
	        dataType: "json",
	        success : function( result )
        	{
				if( result.result )
				{
					$.each(result.records.UENS.item, function( index, value )
					{
		            	$("#form-crear #iduen").append("<option value='"+value.OBJID+"'>"+value.OBJID+" - "+value.MC_SEARK+"</option>");
					});
					$("#form-crear #iduen").trigger("chosen:updated");
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#btn-anularp').on('click', function( e )
	{
		var datos = [];

		jQuery("#participantes > tbody > tr > td")
		.find(".asistencia")
		.each( function(i) 
		{
			if( jQuery(this).is(":checked") )
			{
				var registro = {};
				registro.id = jQuery(this).attr('idsolicitud');
				registro.asis = 1;
				datos.push( registro );
			}

			else
			{
				var registro = {};
				registro.id = jQuery(this).attr('idsolicitud');
				registro.asis = 0;
				datos.push( registro );
			}
		});

		var idsolicitud = (JSON.stringify( datos ) );

		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/voluntariados/marcarasistenciaweb',
			dataType: 	'json',
			data: 		{ lista:idsolicitud },
			success: function( result )
				{
					if( result.result )
					{
						$('#modal-detalle').modal('hide');
						toastr['success'](result.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 500);  
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
	});

	$('#btn-anularpm').on('click', function( e )
	{
		var datos = [];

		jQuery("#participantesm > tbody > tr > td")
		.find(".asistencia")
		.each( function(i) 
		{
			if( jQuery(this).is(":checked") )
			{
				var registro = {};
				registro.id = jQuery(this).attr('idsolicitud');
				registro.asis = 1;
				datos.push( registro );
			}

			else
			{
				var registro = {};
				registro.id = jQuery(this).attr('idsolicitud');
				registro.asis = 0;
				datos.push( registro );
			}
		});

		var idsolicitud = (JSON.stringify( datos ) );

		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/voluntariados/marcarasistenciawebvm',
			dataType: 	'json',
			data: 		{ lista:idsolicitud },
			success: function( result )
				{
					if( result.result )
					{
						$('#modal-detallem').modal('hide');
						toastr['success'](result.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 500);  
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
	});

	/*
	*
	* Lista para tomar asistencia
	*
	* */

	$("#tabla-registros").on('click','a.btn-lista', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/participantes/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					$("#participantes").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
		            	cont++;
		            	if( value.asistencia == 1 )
                    		var input = "<input type='checkbox' class='asistencia' idsolicitud='"+value.id+"' checked>";

                    	else
                    		var input = "<input type='checkbox' class='asistencia' idsolicitud='"+value.id+"'>";

		            	$("#participantes").dataTable().fnAddData( [ 
		            		cont,
		            		value.empleado,
		            		value.pern_empleado,
		            		value.depto_empleado,
		            		input
						]);
		            });
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

    $("#tabla-registros").on('click','a.btn-listam', function( e )
    {
        e.preventDefault();
        idregistro = $(e.target).closest("a").data("idregistro");
        $.ajax({
            type: "GET",
            url : "ws/voluntariados/participantesvm/"+idregistro,
            success : function( result )
            {
                if( result.result )
                {
                    $("#participantesm").dataTable().fnClearTable();
                    var cont = 0;
                    $.each(result.records, function(index, value)
                    {
                        cont++;
                        if( value.asistencia == 1 )
                            var input = "<input type='checkbox' class='asistencia' idsolicitud='"+value.id+"' checked>";
                        else
                            var input = "<input type='checkbox' class='asistencia' idsolicitud='"+value.id+"'>";

                        $("#participantesm").dataTable().fnAddData( [
                            cont,
                            value.solicitante,
                            value.pern_empleado,
                            value.depto_empleado,
                            input
                        ]);
                    });
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

    /*
    *
    * Lista de asistencias confirmadas
    *
    * */

	$("#tabla-registros").on('click','a.btn-participantes', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/participantes/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					$("#asistentes").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
		            	if( value.asistencia == 1 )
		            	{
		            		cont++;
			            	$("#asistentes").dataTable().fnAddData( [ 
			            		cont,
			            		value.empleado,
			            		value.pern_empleado,
			            		value.depto_empleado
							]);
						}
		            });
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

	$("#tabla-registros").on('click','a.btn-participantesm', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/participantesvm/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					$("#asistentesm").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
		            	if( value.asistencia == 1 )
		            	{
		            		cont++;
			            	$("#asistentesm").dataTable().fnAddData( [ 
			            		cont,
			            		value.solicitante,
			            		value.pern_empleado,
			            		value.depto_empleado
							]);
						}
		            });
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


	$("#tabla-registros").on('click','a.btn-excel', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $("#form-importar #idvol").val(idregistro);
	});

	$('#btn-cargarlista').on('click', function( e )
	{
		e.preventDefault();
		if( !subio )
		{
			subio = true;
			toastr[ 'warning' ]( 'Este proceso puede tardar varios minutos, espere a que la pagina se recarge' , 'Espere' );
			var formData = new FormData($('#form-importar')[0]);
		    $.ajax(
		    {
		        type: 			'POST',
		        dataType: 		'json',
		        url: 			'ws/voluntariados/cargarlista',  
		        cache: 			false,
		        contentType: 	false,
		        processData: 	false,
			    data: 			formData,
		        success: function( result )
			        {
			        	if( result.result )
			        	{
				        	toastr['success']( result.message , 'Éxito' );
							setTimeout( function(){ amigable(); }, 500);
							$('#modal-excel').modal('hide');
						}
						else
						{
							toastr['error']( result.message , 'Espera' );
							console.log(result.message);
							setTimeout( function(){ amigable(); }, 500);
							$('#modal-excel').modal('hide');
						}
			        },
		        error: function( e )
			        {
						toastr[ 'error' ]( 'Ocurrió un problema, intenta de nuevo' , 'Error' );
			        }		        
		    });
		}

		else
			toastr[ 'danger' ]( 'Actualice la página, por seguridad solo se permite subir un archivo a la vez' , 'Espere' );
	});

    /*
    *
    * Coordenador de voluntariado por hora.
    *
    * */

	$("#tabla-registros").on('click','a.btn-coordinador', function( e )
	{
		e.preventDefault();
		$('#loader').show();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/coordinador/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					$("#coordinador").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
		            	cont++;
		            	if( value.coordinador == 1 ){
							var input = "<div class='col-md-2'><div class='radio'><label><input type='checkbox' name='radio' class='ecoordinador' idsolicitud='"+value.id+"' email='"+value.usuario_solicitante+"' checked></label></div></div>";
						} else {
		            		var input = "<div class='col-md-2'><div class='radio'><label><input type='checkbox' name='radio' class='ecoordinador' idsolicitud='"+value.id+"' email='"+value.usuario_solicitante+"' ></label></div></div>";
						}

		            	$("#coordinador").dataTable().fnAddData( [ 
		            		cont,
		            		value.empleado,
		            		value.pern_empleado,
		            		value.depto_empleado,
		            		input
						]);
					});
					$('#loader').hide();
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
					$("#modal-detalle").modal('hide');
					$('#loader').hide(); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				$('#loader').hide();
        	}
		});
	});

	$('#btn-ecoordinador').on('click', function( e )
	{
		var idsoli = 0;
		var detail = [];
		$('#loader').show();
		$('#coordinador .ecoordinador').each( function(){
			if ($(this).is(":checked")){
				detail.push($(this).attr('email'));
				idsoli = $(this).attr('idsolicitud');
			}
		});
		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/voluntariados/elegircoordinador',
			dataType: 	'json',
			data: 		{ idsolicitud: idsoli, coordinadores: detail.toString() },
			success: function( result )
				{
					if( result.result )
					{
						$('#modal-coordinador').modal('hide');
						$('#loader').hide();
						toastr['success'](result.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 500);  
					}
					else
					{
						toastr['error'](result.message, 'Error');
						$('#modal-coordinador').modal('hide');
						$('#loader').hide();
					}
				},
			error: function( result )
				{
					$('#loader').hide();
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
		});
	});

    /*
    *
    * Coordinador de voluntariado masivo
    *
    * */

	$("#tabla-registros").on('click','a.btn-coordinadorm', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
		$('#loader').show();
	    $.ajax({
	        type: "GET",
	        url : "ws/voluntariados/participantesvm/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
					$("#coordinadorm").dataTable().fnClearTable();
					var cont = 0;
		            $.each(result.records, function(index, value)
		            {
		            	cont++;
                    	if( value.coordinador == 1 )
		            		var input = "<input type='checkbox' name='radio' class='ecoordinadorm' idsolicitud='"+value.email+"' checked>"
		            	else
		            		var input = "<input type='checkbox' name='radio' class='ecoordinadorm' idsolicitud='"+value.email+"'>"

		            	$("#coordinadorm").dataTable().fnAddData( [ 
		            		cont,
		            		value.solicitante,
		            		value.pern_empleado,
		            		value.depto_empleado,
		            		input
						]);
					});
					$('#loader').hide();
          		}
		  		else
		  		{
					$('#loader').hide();
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				$('#loader').hide();
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$('#btn-ecoordinadorm').on('click', function( e )
	{
		$('#loader').show();
		var detail = [];
		$('#coordinadorm .ecoordinadorm').each( function(){
			if ($(this).is(":checked")){
				detail.push($(this).attr('idsolicitud'));
			}
		});
		
		$.ajax(
		{
			type: 		'POST',
			url: 		'ws/voluntariados/elegircoordinadorvm',
			dataType: 	'json',
			data: 		{ coordinadores:detail.toString() },
			success: function( result )
				{
					if( result.result )
					{
						$('#modal-coordinadorm').modal('hide');
						$('#loader').hide();
						toastr['success'](result.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 500);  
					}
					else
					{
						toastr['error'](result.message, 'Error');
						$('#modal-coordinadorm').modal('hide');
						$('#loader').hide();
					}
				},
			error: function( result )
				{
					$('#loader').hide();
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
		});
	});

	$("#tabla-registros").on('click','a.btn-editarhoras', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax({
	        type: "GET",
	        url : "ws/parametros/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-editar #horas").val(result.records[0].horas_voluntariado);
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


	$('#btn-cambiarhoras').on('click', function( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/parametros/'+idregistro,
				dataType: 	'json',
				data: 		{horas: $('#horas').val()},
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
	});

	$("#form-crear").validate(
	{
		rules: 
		{
			idtipov:{
				required: true,
				min: 1
			},
			descripcion:{
				required: true,
				maxlength: 30
			},
			informacion:{
				required: true,
				maxlength: 20
			}
		},
		messages:
		{
			idtipov:{
				min: 'Este campo es obligatorio'
			},
			descripcion:{
				maxlength: 'Este campo solo puede tener 30 caracteres'
			},
			informacion:{
				maxlength: 'Este campo solo puede tener 20 caracteres'
			}
		}
	});

	/*
	*
	*  Funciones para bloquear select al editar
	*
	* */
	$('#edit_sociedad').on('click', function(){
		if ( $('#edit_sociedad').val() != null ) {
			$('#edit_ceco').attr('disabled','disabled');
			$('#edit_uen').attr('disabled','disabled');
			$('#edit_grupos_cecos').attr('disabled','disabled');
		}
		else{
			$('#edit_ceco').removeAttr('disabled');
			$('#edit_uen').removeAttr('disabled');	
			$('#edit_grupos_cecos').removeAttr('disabled');
		}
	});
	$('#edit_uen').on('click', function(){
		if ( $('#edit_uen').val() != null ) {
			$('#edit_sociedad').attr('disabled','disabled');
			$('#edit_ceco').attr('disabled','disabled');
			$('#edit_grupos_cecos').attr('disabled','disabled');
		}
		else{
			$('#edit_sociedad').removeAttr('disabled');
			$('#edit_ceco').removeAttr('disabled');	
			$('#edit_grupos_cecos').removeAttr('disabled');
		}
	});
	$('#edit_ceco').on('click', function(){
		if ( $('#edit_ceco').val() != null ) {
			$('#edit_sociedad').attr('disabled','disabled');
			$('#edit_uen').attr('disabled','disabled');
			$('#edit_grupos_cecos').attr('disabled','disabled');
		}
		else{
			$('#edit_sociedad').removeAttr('disabled');	
			$('#edit_uen').removeAttr('disabled');
			$('#edit_grupos_cecos').removeAttr('disabled');
		}
	});

    $('#edit_grupos_cecos').on('click', function(){
        if ( $('#edit_grupos_cecos').val() != null ) {
            $('#edit_sociedad').attr('disabled','disabled');
            $('#edit_uen').attr('disabled','disabled');
            $('#edit_ceco').attr('disabled','disabled');
        }
        else{
            $('#edit_sociedad').removeAttr('disabled');
            $('#edit_uen').removeAttr('disabled');
            $('#edit_ceco').removeAttr('disabled');
        }
    });

    /*
	*
	*  Funciones para bloquear select al duplicados
	*
	* */
	$('#duplicado_sociedad').on('click', function(){
		if ( $('#duplicado_sociedad').val() != null ) {
			$('#duplicado_ceco').attr('disabled','disabled');
			$('#duplicado_uen').attr('disabled','disabled');
			$('#duplicado_grupos_cecos').attr('disabled','disabled');
		}
		else{
			$('#duplicado_ceco').removeAttr('disabled');
			$('#duplicado_uen').removeAttr('disabled');
			$('#duplicado_grupos_cecos').removeAttr('disabled');
		}
	});
	$('#duplicado_uen').on('click', function(){
		if ( $('#duplicado_uen').val() != null ) {
			$('#duplicado_sociedad').attr('disabled','disabled');
			$('#duplicado_ceco').attr('disabled','disabled');
            $('#duplicado_grupos_cecos').attr('disabled','disabled');
        }
		else{
			$('#duplicado_sociedad').removeAttr('disabled');
			$('#duplicado_ceco').removeAttr('disabled');
            $('#duplicado_grupos_cecos').removeAttr('disabled');
		}
	});
	$('#duplicado_ceco').on('click', function(){
		if ( $('#duplicado_ceco').val() != null ) {
			$('#duplicado_sociedad').attr('disabled','disabled');
			$('#duplicado_uen').attr('disabled','disabled');
            $('#duplicado_grupos_cecos').attr('disabled','disabled');
        }
		else{
			$('#duplicado_sociedad').removeAttr('disabled');	
			$('#duplicado_uen').removeAttr('disabled');
            $('#duplicado_grupos_cecos').removeAttr('disabled');
		}
	});
    $('#duplicado_grupos_cecos').on('click', function(){
        if ( $('#duplicado_grupos_cecos').val() != null ) {
            $('#duplicado_sociedad').attr('disabled','disabled');
            $('#duplicado_uen').attr('disabled','disabled');
            $('#duplicado_ceco').attr('disabled','disabled');
        }
        else{
            $('#duplicado_sociedad').removeAttr('disabled');
            $('#duplicado_uen').removeAttr('disabled');
            $('#duplicado_ceco').removeAttr('disabled');
        }
	});
	
	/*
	*
	* Voluntariados en fechas multiples
	*
	* */

    $("#multiple").change(function(){
		if($("#multiple").prop('checked')){
			$('.date-multiple').show();
			$('#container-main').show();
		}else{
			$('.date-multiple').hide();
			$('#container-main').hide();
		}
	});

    /*
    *
    * Agregar fecha
    *
    * */

	$('#btn-add').click(function(e){
        e.preventDefault();
        $('#container-main').append('<div class="row" id="container">'+
                '<div class="form-group">'+
                    '<div class="col-md-10">'+
                        '<input type="date" class="form-control detail input-date-picker" required/>'+
                    '</div>'+
                    '<div class="col-md-2">'+
                        '<a class="btn btn-danger remove"><i class="fa fa-minus-circle"></i></a>'+
                    '</div>'+
                '</div>'+
                '<br><br>'+
            '</div>'
        );
	});

	/*
	*
	* Eliminar compo de fecha
	*
	* */
	$('#container-main').on("click",".remove", function(e){
        e.preventDefault(); $(this).parent().parent().parent().remove();
	});

	// Funcion de un minimo de coordinadores de 2
	$('#coordinador').on('change','input.ecoordinador', function(){
			  
		var elemento = this;
		var contador = 0;

		$("#coordinador input[type=checkbox]").each(function(){
			if($(this).is(":checked"))
				contador++;
		});
		
		var cantidadMaxima= 2 || 0;

		if(contador>cantidadMaxima)
		{
			toastr['warning']('Solo puede elegir a 2 coordinadores', 'Límite de coordinadores');
			$(elemento).prop('checked', false);
			contador--;
		}
	});

	// Funcion de un minimo de coordinadores de 2
	$('#coordinadorm').on('change','input.ecoordinadorm', function(){
		
		var elemento   = this;
		var contadorMV = 0;
		
		$("#coordinadorm input[type=checkbox]").each(function(){
			if($(this).is(":checked"))
				contadorMV++;
		});
	
		var cantidadMaxima= 2 || 0;	

		if(contadorMV>cantidadMaxima)
		{
			toastr['warning']('Solo puede elegir a 2 coordinadores', 'Límite de coordinadores');
			$(elemento).prop('checked', false);
			contadorMV --;
		}
});
});