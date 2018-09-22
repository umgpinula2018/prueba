jQuery( document ).ready( function( $ ){

	var ideditar = 0;
	var ideliminar = 0;
	var idSolicitud = 0;
	var detallePropuesta = '';

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: "today"
    });

	window.tablaSolicitudes = $("#tabla-registros").DataTable(
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

	window.tablaProveedores = $("#tabla-proveedores-enviados").DataTable(
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
//-----------------------------------------------------FUNCION PARA LLENAR TABLA-------------------------------------
	function llenarTabla(){

		$("#loader").show();
		window.tablaSolicitudes.clear().draw();

		$.ajax({
			url:		'ws/compras/compraspropuestas',
			type:		'GET',
			dataType: 	'json'
			}
		)
		.done(function(data){	
			if( data.result ){

				contador = 0;		
				
				$.each(data.records, function(index,value){

					var tipo = tipoCompras( value.tipo_compra );

					switch (parseInt(value.estado)) {
						case 5:
							estado = "<center><span class=\"label label-info\">Recibidas</span></center>";
							break;
						case 6:
							estado = "<center><span class=\"label label-success\">Enviado a aprobación</span></center>";
							break;
					};

					contador++;
					counter1 = contador;
					counter2 = value.no_correlativo;
					counter3 = value.solicitante_nombre;
					counter4 = tipo;
					counter5 = value.fecha_solicitud;
					counter6 = '<center><span class="label label-warning">'+value.cant_propuestas+' / '+value.cant_proveedores+'</span></center>';
					counter7 = estado;
					counter8 = '<center><a style="margin-right:3px;" class="btn-ver btn btn-info btn-xs" title="Detalle de solicitud" href="#modal-detalle" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-eye"></i></a>'+
							   '<a style="margin-right:3px;" class="btn-proveedores btn btn-warning btn-xs" title="Proveedores" href="#modal-proveedores" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-users"></i></a>';
						  	  	if( value.estado == 5)
						  	    	counter8 += '<a class="btn-verpropuestas btn btn-success btn-xs" title="Enviar propuestas" href="#modal-propuestas" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-paper-plane-o"></i></a></center>';
						  	    else
						  	    	counter8 += '<a class="btn-verpropuestas btn btn-danger btn-xs" title="Enviar propuestas" href="#modal-propuestas" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-paper-plane-o"></i></a></center>';

					window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8]).draw(false);


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

//-------------------------------------------------------FUNCIONES DE TABLA-----------------------------------------------

	$("#tabla-registros").on('click', '.btn-verpropuestas', function( e ){
		e.preventDefault();

		var idregistro = $(e.target).closest('a').data('idsolicitud');
		
		$('#tabla-proveedores tbody').html('');
		$('#detallePropuesta').html('');
		
		$.ajax(
		{
	        type: 		'GET',
	        url: 		'ws/compras/propuestasproveedores',
	        dataType: 	'json',
	        data: 		{compra_id:idregistro},
	        success : function( data )
        	{
				if( data.result )
				{
					var contador = 0;
					$.each(data.records, function(index, value) {

						var fila = '';
						contador++;

						if( value.estado == 2){
							fila += '<tr>'
										+'<td>'+contador+'</td>'
										+'<td>'+value.proveedor+'</td>'
										+'<td>'
											+'<div class="input-group widthinput">'
												+'<a class="btn-detallepropuesta btn btn-success btn-xs widthbutton" title="Detalle de solicitud" data-idsolicitud="'+value.id+'"><i class="fa fa-eye widthicon"></i></a>'
												+'<span class="input-group-addon widthcheck" style="margin-left:3px;"><input type="checkbox" class="aceptado" data-idsolicitud="'+value.propuestas_proveedores.id+'"></input></span>'
											+'</div>'
										+'</td>'
									+'</tr>';
						}
						else{
							fila += '<tr>'
										+'<td>'+contador+'</td>'
										+'<td>'+value.proveedor+'</td>'
										+'<td>'
											+'<div class="input-group widthinput">'
												+'<a class="btn-detallepropuesta btn btn-success btn-xs widthbutton" title="Detalle de solicitud" data-idsolicitud="'+value.id+'"><i class="fa fa-eye widthicon"></i></a>'
											+'</div>'
										+'</td>'
									+'</tr>';
						}

						$('#tabla-proveedores').append(fila);

						var detalle = value.propuestas_proveedores;
						var detallesDetalle = jQuery.parseJSON(detalle.detalles);
						var detallePropuesta = '<div id="detalle_'+value.id+'" class="detallepropuesta hidden">'+
													'<form class="form-horizontal"><fieldset>'+
														'<legend>Proveedor: <strong>'+value.proveedor+'</strong></legend>'+
														'<div class="col-sm-2"></div>'+
														'<div class="col-sm-8">'+
															'<table class="table">'+
																'<thead>'+
																	'<tr>'+
																		'<th>Descripción</th>'+
																		'<th>Cantidad</th>'+
																		'<th>Monto</th>'+
																	'</tr>'+
																'</thead>'+
																'<tbody>'+
																	'<tr>'+
																		'<td>'+detallesDetalle[0].descripcion+'</td>'+
																		'<td>'+detallesDetalle[0].cantidad+'</td>'+
																		'<td>Q.'+detallesDetalle[0].monto+'</td>'+
																	'</tr>'+
																'</tbody>'+
															'</table>'+
														'</div>'+
														'<div class="col-sm-2"></div>'+
														'<div class="col-sm-12"><legend></legend><br></div>'+
														'<div class="form-group">'+
															'<div class="col-sm-2"></div>'+
															'<label class="control-label col-sm-2">Monto total:</label>'+
															'<div class="col-sm-6">'+
						    									'<input class="form-control" value="'+detalle.monto+'" disabled>'+
						    								'</div>'+
														'</div>'+
														'<div class="form-group">'+
															'<div class="col-sm-2"></div>'+
															'<label class="control-label col-sm-2">Observaciones:</label>'+
															'<div class="col-sm-6">'+
						    									'<input class="form-control" value="'+detalle.descripcion+'" disabled>'+
						    								'</div>'+
														'</div>'+
														'<div class="form-group">'+
															'<div class="col-sm-2"></div>'+
															'<label class="control-label col-sm-2">Adjunto:</label>'+
															'<div class="col-sm-6">'+
																'<a class="btn btn-success" href="'+detalle.adjunto+'" download title="Adjunto">Archivo adjunto</a>'+
						    								'</div>'+
														'</div>'+
													'</fieldset></form>'+
												'</div>';

						$('#detallePropuesta').append(detallePropuesta);

						$('.btn-detallepropuesta').on('click', mostrarDetalle);

						$('.aceptado').on('change', activarEnviar);
					});

					$('#comentario_comprador').val(data.records[0].proveedor_compra.comentario);
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide');
	          	}     
	        },
	        error: function( err )
        	{
        		console.log(err);
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	function mostrarDetalle( e ){
		var id = $(e.target).closest('a').data('idsolicitud');
		$('.detallepropuesta').addClass('hidden');
		$('#detalle_'+id).removeClass('hidden');
	}

	$("#tabla-registros").on('click', '.btn-ver', function( e ){
		
		e.preventDefault();
		idregistro = $(e.target).closest('a').data('idsolicitud');

		$.ajax(
		{
	        type: 		'GET',
	        url: 		'ws/compras/consultacompra/'+idregistro,
	        dataType: 	'json',
	        success : function( result )
        	{
				if( result.result )
				{
					$("#form-detalle").html("");
					$('#form-detallesolicitud').remove();

					var tipo = tipoCompras(result.records.tipo_compra);

					$("#comprador").text(result.records.comprador_nombre);
					$("#cuenta_mayor").text(result.records.cuenta_mayor);
					$("#tipo_imputacion").text(result.records.tipo_imputacion);
					$("#centro").text(result.records.centro);
					$("#centro_costo").text(result.records.centro_costo_descripcion);
					$("#grupo_articulo").text(result.records.grupo_articulo);
					$("#tipo_impuesto").text(result.records.tipo_impuesto);
					$("#job").text(result.records.job_solped);
					$("#clase_documento").text(result.records.clase_documento);

					$("#tipo_compra").text("Solicitud de "+tipo);

					campos_formulario = jQuery.parseJSON(result.records.formulario);

					var detalle = "<form class='form-horizontal' id='form-detallesolicitud'><fieldset>";

					$.each(campos_formulario, function(i, elem) {

						if(elem.input != "observaciones"){
							detalle += 	"<div class='col-md-6'>"+
											"<div class='form-group'>"+
												"<label class='control-label col-sm-6'>"+elem.label+":</label>"+					    
												"<div class='col-sm-6'>"+
			    									"<input class='form-control' value='"+elem.value+"' disabled>"+
			    								"</div>"+
			    							"</div>"+
			    						"</div>"; 		      
						}  
						else{
							detalle += 
										"<div class='col-md-12'>"+
											"<div class='form-group'>"+
												"<label class='control-label col-sm-3'>"+elem.label+":</label>"+					    
												"<div class='col-sm-9'>"+
			    									"<textarea class='form-control' rows='3'  disabled>"+elem.value+"</textarea>"+
			    								"</div>"+
			    							"</div>"+
			    						"</div>";	
						}

				    });

					if(result.records.adjunto != ''){

						detalle += 	"<div class='col-md-6'>"+
										"<div class='form-group'>"+
											"<label class='control-label col-sm-6'>Adjunto:</label>"+					    
											"<div class='col-sm-6'>"+
		    									"<a class='btn btn-success' href='"+result.records.adjunto+"' download title='Adjunto'>Archivo adjunto</a>"+
		    								"</div>"+
		    							"</div>"+
		    						"</div>";
					}
				    
				    detalle += "</fieldset></form>";
				    $("#form").append(detalle);		
						
          		}

		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	        },
	        error: function( err )
        	{
        		console.log(err);
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});

	});


	$("#tabla-registros").on('click', '.btn-proveedores', function( e ){

		var idregistro = $(e.target).closest('a').data('idsolicitud');

		window.tablaProveedores.clear().draw();

		$.ajax({
			url:		'ws/compras/proveedores',
			type:		'GET',
			dataType: 	'json',
			data:        {compra_id:idregistro}
		})
		.done(function(data){
			if( data.result ){	

				contador = 0;	
				$.each(data.records, function(index,value){

					contador++;
					counter5 = '';

					counter1 = contador;
					counter2 = value.cedula;
					counter3 = value.proveedor;
					counter4 = value.email;

					if(value.estado == 1)
						counter5 = '<center><span class="label label-info">Enviado</span></center>';
					if(value.estado == 2)
						counter5 = '<center><span class="label label-success">Recibido</span></center>';
					if(value.estado == 3)
						counter5 = '<center><span class="label label-warning">Enviado a cliente interno</span></center>';

					window.tablaProveedores.row.add([counter1,counter2,counter3,counter4,counter5]).draw(false);
				});
			}
		})
		.fail(function(err){
			console.log(err);
		})
	});

//---------------------------------------------------------EVENTOS-----------------------------------------------

	$('#btn-enviar').on('click', enviarPropuestas);

//---------------------------------------------------------TIPO DE COMPRAS--------------------------------------

	function activarEnviar(){

		var cant_check = $('.aceptado:checked').length;

		if(cant_check > 0){
			$('#btn-enviar').removeClass('hidden');
			$('#comentario_comprador').removeAttr('disabled');
			$('#comentario_comprador').focus();
		}
		else{
			$('#btn-enviar').addClass('hidden');
			$('#comentario_comprador').attr('disabled', true);
		}
	}

	function enviarPropuestas (){

		var array_propuestas = Array();
		
		$('.aceptado:checked').each( function(){
			
			if(!$(this).is(':disabled')){

				var item = Object();
				item.id = $(this).data('idsolicitud');

				array_propuestas.push(item);
			}	
			
			$(this).attr('disabled',true);

		});

		if( array_propuestas.length > 0){
			var propuestas = JSON.stringify(array_propuestas);
			var comentario = $('#comentario_comprador').val();
			$.ajax({
	            type: 'POST',
	            url: 'ws/compras/enviarpropuestas',
	            dataType: 'json',
	            data: {propuestas: propuestas, comentario_comprador:comentario},
	            success: function (data) {
	                if (data.result) {
	                	$('#modal-propuestas').modal('hide');
						toastr['success'](data.message, 'Éxito');
						setTimeout( function(){ amigable(); }, 500);
	                }
	            },
	            error: function (data) {
	                toastr['error'](data.message, 'Error');
	            },
	            complete: function (data) {}
	        });
		}
	}

	function tipoCompras( tipo ){

		var tipoCompra;

        switch (parseInt(tipo)) {
            case 1:
                tipoCompra = "Materia Prima";
                break;
            case 2:
                tipoCompra = "Respuestos";
                break;
            case 3:
                tipoCompra = "Electrónicos";
                break;
            case 4:
                tipoCompra = "Textiles";
                break;
            case 5:
                tipoCompra = "Promocionales";
                break;
            case 6:
                tipoCompra = "Rotulación y material pop";
                break;
            case 7:
                tipoCompra = "Otros";
                break;
            case 8:
                tipoCompra = "Eventos";
                break;
            case 9:
                tipoCompra = "Viajes e incentivos";
                break;
            case 10:
                tipoCompra = "Construcción";
                break;
            case 11:
                tipoCompra = "Reparaciones";
                break;
            case 12:
                tipoCompra = "Cotización de fletes";
                break;
            case 13:
                tipoCompra = "Alquiler de bodega";
                break;
            case 14:
                tipoCompra = "Camiones";
                break;
            default:
                tipoCompra = "Prueba";
                break;
        };

        return tipoCompra;
	}

});