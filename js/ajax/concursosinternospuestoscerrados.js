jQuery( document ).ready( function( $ )
{
	var idregistro = 0;
	var ideliminar = 0;
	var paises 	   = '[{"codigo_pais":"CR","nombre_pais":"Costa Rica"},{"codigo_pais":"GT","nombre_pais":"Guatemala"}]';

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "top",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
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

	window.tabla_registros = $('.datatable').DataTable(
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

	//Eventos
	llenarTabla();
	llenarPaises('#form-duplicar #idpaisd');
	llenarUens('#form-duplicar #iduend');
	$('#btn-duplicar').on('click', duplicar);

	//Funciones
	function llenarTabla()
	{
		$('#loader').show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/concursos/puestos/cerrados',
			dataType: 	'json'
		})
		.done(function( data )
		{
			if( data.result )
			{
				cont = 0;
				$.each(data.records, function( index, value)
				{
					col1 = ++cont;
					col2 = value.puesto;
					col3 = value.descripcion;
					col4 = value.fecha_inicio;
					col5 = value.fecha_fin;
					col6 = value.paises_txt;
					col7 = value.uens_txt;
					col8 = '<span class="label label-info enabledd" data-idregistro="'+value.id+'">'+value.destacado_txt+'</span>';
					col9 = value.nombre_usuario_creo;
					col10 = '<span class="label label-danger" data-idregistro="'+value.id+'">'+value.estado_txt+'</span>';
					col11 = '<a margin-bottom:3px;" class="btn btn-success btn-xs btn-duplicar" href="#modal-duplicar" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-exchange"></i></a>';
					window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11]).draw(false);
				});
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function()
		{
			$('#loader').fadeOut();
		});
	}

	function llenarPaises(selector)
	{
		lista_paises = JSON.parse( paises );
		$(selector).find('option').remove().end();
		$.each(lista_paises, function(index, value)
		{
			$(selector).append($("<option />").val(value.codigo_pais).text(value.codigo_pais+' - '+value.nombre_pais));
		});
		$(selector).select2({ });
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
				$.each(data.records.UENS.item, function(index, value)
				{
					$(selector).append($("<option />").val(value.OBJID).text(value.OBJID+' - '+value.STEXT));
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

	// ------------------------------------------------------------ MOSTRAR INFORMACIÓN DEL PUESTO AL DUPLICAR --------------------------------------------------------------------
	$("#tabla-registros").on('click','a.btn-duplicar', function( e )
	{
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
		$('#form-duplicar #idusuario_d').val(localStorage.getItem("USUARIO").toUpperCase());
		
		$.ajax(
		{
	        type: "GET",
	        url : "ws/concursos/"+idregistro,
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#form-duplicar #puesto_d").val(result.records.puesto);
		            $("#form-duplicar #descripcion_d").val(result.records.descripcion);
		            $("#form-duplicar #fecha_inicio_d").val(result.records.fecha_inicio);
		            $("#form-duplicar #fecha_fin_d").val(result.records.fecha_fin);
		            $('#form-duplicar #div-habilidades').find('.note-editor').find('.note-editable').html(result.records.habilidades);
		            $('#form-duplicar #div-responsabilidades').find('.note-editor').find('.note-editable').html(result.records.responsabilidades);
		            $('#form-duplicar #div-requisitos').find('.note-editor').find('.note-editable').html(result.records.requisitos);
		            result.records.destacado == 1 ? $("#form-duplicar #destacado_d").attr('checked', 'checked') : $("#form-duplicar #destacado_d").removeAttr('checked', 'checked');
		            $('#form-duplicar #idpaisd').val(result.records.array_paises).trigger("change");
		            $('#form-duplicar #idsociedadd').val(result.records.array_sociedades).trigger("change");
		            $('#form-duplicar #iduend').val(result.records.array_uens).trigger("change");
          		}

		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-duplicar").modal('hide'); 
	          	}      
	        },
	        error: function( err )
        	{
				console.log(err);
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	// ------------------------------------------------------------ DUPLICAR PUESTO -----------------------------------------------------------------------------------
	function duplicar( e )
	{
		e.preventDefault();
		if( $('#form-duplicar').valid() )
		{
			if( $('#fecha_fin_d').datepicker('getDate') >= $('#fecha_inicio_d').datepicker('getDate') )
			{
				var paisa = $('#idpaisd').val() != null ? $('#idpaisd').val() : [];
				var uena = $('#iduend').val() != null ? $('#iduend').val() : [];
				var sociedada = $('#idsociedadd').val() != null ? $('#idsociedadd').val() : [];

				if( uena.length > 0 && paisa.length == 0 && sociedada.length == 0 )
				{
					var uen = $('#iduend').val().join();
					$.ajax(
					{
						type: 		'POST',
						url: 		'ws/concursos',
						dataType: 	'json',
						data: 		$('#form-duplicar').serialize()+'&habilidades='+$('#habilidades_d').code()+'&responsabilidades='+$('#responsabilidades_d').code()+'&requisitos='+$('#requisitos_d').code()+'&uen='+uen,
						success: function( result )
							{
								if( result.result )
								{
									$('#modal-duplicar').modal('hide');
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

				else
				{
					if( paisa.length > 0 && uena.length == 0 && sociedada.length == 0 )
					{
						var pais = $('#idpaisd').val().join();
						$.ajax(
						{
							type: 		'POST',
							url: 		'ws/concursos',
							dataType: 	'json',
							data: 		$('#form-duplicar').serialize()+'&habilidades='+$('#habilidades_d').code()+'&responsabilidades='+$('#responsabilidades_d').code()+'&requisitos='+$('#requisitos_d').code()+'&pais='+pais,
							success: function( result )
								{
									if( result.result )
									{
										$('#modal-duplicar').modal('hide');
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

					else
					{
						if( sociedada.length > 0 && paisa.length == 0 && uena.length == 0 )
						{
							var sociedad = $('#idsociedadd').val().join();
							$.ajax(
							{
								type: 		'POST',
								url: 		'ws/concursos',
								dataType: 	'json',
								data: 		$('#form-duplicar').serialize()+'&habilidades='+$('#habilidades_d').code()+'&responsabilidades='+$('#responsabilidades_d').code()+'&requisitos='+$('#requisitos_d').code()+'&sociedad='+sociedad,
								success: function( result )
									{
										if( result.result )
										{
											$('#modal-duplicar').modal('hide');
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

						else
						{
							toastr['error']('Solo debe elegir un valor, Pais, Sociedad o UEN', 'Error');
						}
					}
				}
			}
			else
				toastr['error']('Fechas invalidas, por favor revise', 'Error');
		}
	}
});