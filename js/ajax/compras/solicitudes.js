jQuery( document ).ready( function( $ ){

	var ideditar = 0;
	var ideliminar = 0;
	var idSolicitud = 0;

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

	window.tablaProveedores = $("#tabla-proveedores").DataTable(
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
	
	/* Esta función hace la carga de datos en las tablas de 
		Ordenes, Aprobados y Rechazados*/

	function llenarTabla(){
		var estado = $("#estado").val();

		$("#loader").show();

		window.tablaSolicitudes.clear().draw();

		$.ajax({
			url:		'ws/compras/solicitudes',
			type:		'GET',
			dataType: 	'json',
			data: 		{estado:estado}
			}
		)
		.done(function(data){	
			if( data.result ){
				contador = 0;		
				$.each(data.records, function(index,value){

					var tipo = tipoCompras( value.tipo_compra );

					switch (parseInt(value.estado)) {
						case 1: 
							estado = "<center><span class=\"label label-info\">Pendiente</span></center>";
							break;
						case 2:
							estado = "<center><span class=\"label label-success\">Aprobado</span></center>";
							break;
						case 3:
							estado = "<center><span class=\"label label-danger\">Rechazado por compras</span></center>";
							break;
						case 4:
							estado = "<center><span class=\"label label-warning\">Enviado a Proveedores</span></center>";
							break;
						case 5:
							estado = "<center><span class=\"label label-warning\">Propuestas recibidas</span></center>";
							break;
						case 7:
							estado = "<center><span class=\"label label-info\">Solped generada</span></center>";
							break;
					};

					contador++;
					counter1 = contador;
					counter2 = value.no_correlativo;
					counter3 = value.solicitante_nombre;
					counter4 = tipo;
					counter5 = value.fecha_solicitud;

					if(value.estado == 2)
						counter6 = '';
					if(value.estado == 7)
						counter6 = value.no_solped;

					counter7 = estado;
					if(value.estado == 1){
						counter8 = '<center><a class="btn-ver btn btn-success btn-xs" title="Detalle de solicitud" href="#modal-detalle" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-eye"></i></a>'+
							   	   '<a style="margin-left:3px;" class="btn-proveedores btn btn-info btn-xs" title="Proveedores" href="#modal-proveedores" data-toggle="modal" data-idcompra="'+value.id+'"><i class="fa fa-users"></i></a>'+
							   	   '<a style="margin-left:3px;" class="btn-rechazar btn btn-danger btn-xs" title="Rechazar solicitud" href="#modal-rechazar" data-toggle="modal" data-idcompra="'+value.id+'"><i class="fa fa-close"></i></a></center>';
					}else
						if(value.estado == 2){
							counter8 = '<center><a class="btn-solped btn btn-success btn-xs" title="Detalle de solicitud" href="#modal-detalle" data-toggle="modal" data-idsolicitud="'+value.id+'">Crear Solped</a></center>';
						}
						else{
							if(value.estado == 3){
								counter8 = '<center><a class="btn-ver btn btn-success btn-xs" title="Detalle de solicitud" href="#modal-detalle" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-eye"></i></a></center>';		
							}
							else{
								if(value.estado == 4){
									counter8 = '<center><a class="btn-ver btn btn-success btn-xs" title="Detalle de solicitud" href="#modal-detalle" data-toggle="modal" data-idsolicitud="'+value.id+'"><i class="fa fa-eye"></i></a>'+
										   	   '<a style="margin-left:3px;" class="btn-proveedores btn btn-info btn-xs" title="Proveedores" href="#modal-proveedores" data-toggle="modal" data-idcompra="'+value.id+'"><i class="fa fa-users"></i></a></center>';
								}
								else{
									counter8 = "";
								}
							}
						}

					if(value.estado == 2 || value.estado == 7)
						window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8]).draw(false);
					else
						window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter7,counter8]).draw(false);

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

//----------------------------------------FUNCION PARA LLENAR TABLA DE PROVEEDORES ASIGNADOS--------------

	/*
		Función para llenar tabla de proveedores agregados para solicitar cotización, se carga en la vista de ordenes en el
		modal de enviar a proveedores
	*/
	function llenarTablaProveedores( compra_id )
	{
		$('#form-proveedor #compra_id').val(compra_id);

		window.tablaProveedores.clear().draw();

		$.ajax({
			url:		'ws/compras/proveedores',
			type:		'GET',
			dataType: 	'json',
			data:        {compra_id:compra_id}
		})
		.done(function(data){
			if( data.result ){	

				var contador = 0;	
				var pendientes = 0;	
				$.each(data.records, function(index,value){
					contador++;
					counter1 = contador;
					counter2 = parseInt(value.codigo);
					counter3 = value.proveedor;
					counter4 = value.email;
					if (value.estado == 0) {
						counter5 = '<center><a style="margin-left:3px;" class="btn-eliminarproveedor btn btn-danger btn-xs" data-ideliminar="'+value.id+'"><i class="fa fa-times-circle"></i></a></center>';
						pendientes++; 
					} else {
						counter5 = '<center><span class="label label-success">Enviado</span></center>';
					}					
					window.tablaProveedores.row.add([counter1,counter2,counter3,counter4,counter5]).draw(false);
				});

				var proveedoresAgregados = $('#tabla-proveedores tbody > tr[role="row"]').length;

				if( pendientes > 0 && proveedoresAgregados > 0){
					$("#btn-enviar").removeClass('hidden');	
					$("#comentario_proveedores").removeAttr('disabled');
				}
				else{
					$("#btn-enviar").addClass('hidden');
					$("#comentario_proveedores").text(data.records[0].comentario);	
					$("#comentario_proveedores").attr('disabled', true);	
				}
			}
		})
		.fail(function(err){
			console.log(err);
		})
	}

//-------------------------------------------------------FUNCIONES DE TABLA-----------------------------------------------
	$("#tabla-registros").on('click', '.btn-proveedores', function( e ){
		e.preventDefault();

		$('#buscar').val('');
		$('#form-proveedor').validate().resetForm();

		llenarTablaProveedores($(this).data('idcompra'));
	});

//-----------------------------------------MOSTRAR EL DETALLE DE LA SOLICITUD -----------------------------------------------
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

					if( result.records.adjunto != ''){
						detalle += 	"<div class='col-md-6'>"+
										"<div class='form-group'>"+
											"<label class='control-label col-sm-6'>Adjunto:</label>"+					    
											"<div class='col-sm-6'>"+
		    									"<a class='btn btn-success' href='"+result.records.adjunto+"' download title='Adjunto'>Archivo adjunto</a>"+
		    								"</div>"+
		    							"</div>"+
		    						"</div>";
		    		}

				    if(result.records.estado == 3){
				    	$("#rechazado").removeClass('hidden')
				    	$("#descripcion_rechazo").text(result.records.motivo_rechazo)
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

//----------------------------------------- EVENTO PARA GENERAR EL RECHAZO -----------------------------------------------
	$("#tabla-registros").on('click', '.btn-rechazar', function( e ){
		e.preventDefault();
		$('#id').val($(e.target).closest("a").data("idcompra"));
	});

//--------------------- FUNCION PARA ELIMINAR EL PROVEEDOR DE LA TABLA PARA ENVIAR A PROVEEDORES -------------------------
	$("#tabla-proveedores").on('click', '.btn-eliminarproveedor', function( e ){
		e.preventDefault();
		idproveedor = $(e.target).closest("a").data("ideliminar");

		$.ajax
		({
			type:	"DELETE",
			url:	'ws/compras/proveedores/'+idproveedor,
			success: function( result )
			{
				if( result.result )
				{
					idcompra = $('#form-proveedor #compra_id').val();
					llenarTablaProveedores(idcompra);
					toastr['success'](result.message, 'Éxito')
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

//---------------------------------------------------------EVENTOS-----------------------------------------------
	
	$('#buscar').on('change', buscarProveedor);
	$('#btn-agregar-proveedor').on('click', agregarProveedor);
	$("#btn-enviar").on('click', enviarproveedores);
	$("#btn-rechazarsolicitud").on('click', rechazarSolicitud);
	$("#btn-generarsolped").on('click', generarSolped);

//---------------------------------------------------------TIPO DE COMPRAS--------------------------------------
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
//---------------------------------------------------FUNCION BUSCAR PROVEEDORES---------------------------------
	function buscarProveedor( e )
	{
		var proveedor = $(this).val();

		$.ajax({
			url:		'ws/compras/proveedor',
			type:		'GET',
			dataType: 	'json',
			data:        {proveedor:proveedor}
		})
		.done(function(data){		
			if( data.result )
			{	
				$('#proveedor').focus();
				$('#proveedor').find('option').remove().end();
				$('#proveedor').append($("<option />").val('0').text('Seleccione un proveedor'));
				
				$.each(data.records.TA_PROVEEDOR.item, function(index, value){
					$('#proveedor').append($("<option />").val(value.LIFNR+'-'+value.STCD1).text(parseInt(value.LIFNR)+' - '+value.NAME1));
				});
				
				$('#proveedor').select2({ });
			}
			else
				console.log(data.message);	
		})
		.fail(function(err){
			console.log(err);
		})
	}

//---------------------------------------------------FUNCION AGREGAR PROVEEDORES-------------------------------
	function agregarProveedor( e )
	{

		var textProveedor = $("#proveedor option:selected").text();
		var valProveedor = $("#proveedor option:selected").val();
		var nombreProveedor = textProveedor.split(" - ");
		var codigoProveedor = valProveedor.split("-");

		e.preventDefault();

		if( $( '#form-proveedor' ).valid() )
		{
			if ($('#proveedor').val() != 0) {
				
				var datos = $('#form-proveedor').serialize()+"&proveedor="+nombreProveedor[1]+"&cedula="+codigoProveedor[1]+"&codigo="+codigoProveedor[0];

				$.ajax(
				{
					type: 		'POST',
					url: 		'ws/compras/proveedores',
					dataType: 	'json',
					data: 		datos,
					success: function( data )
						{
							if( data.result )
							{
								idcompra = $('#form-proveedor #compra_id').val();

								$('#buscar').val('');
								$('#proveedor').val('0').trigger('change');
								$('#form-proveedor')[0].reset();
								$('#form-proveedor').validate().resetForm();

								$('.form-control').removeClass('valid');
        						$('.form-control').removeClass('error');

								llenarTablaProveedores(idcompra);
								toastr['success'](data.message, 'Éxito');
							}
							else
							{
								toastr['error'](data.message, 'Error');
							}
						},
					error: 	function( result )
						{
							toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
						}
				});
			}else{
				toastr['warning']('Debe de seleccionar un proveedor', 'Proveedor');
			}
		}
	}
//------------------------------------------------FUNCION ENVIAR CORREOS PROVEEDORES----------------------------
	function enviarproveedores( e )
	{	
		$("#loader").show();
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/compras/enviarproveedores',
			dataType: 	'json',
			data: 		{compra_id:$('#form-proveedor #compra_id').val(), comentario:$('#comentario_proveedores').val()}
		})
		.done(function( data ){
			if( data.result )
			{
				$("#btn-enviar").addClass('hidden');	
				$('#modal-proveedores').modal('hide');
				llenarTabla();
				toastr['success'](data.message, 'Éxito');
			}
			else
				toastr['warning'](data.message, 'Error');
		})
		.fail(function(err){
			console.log(err);
		})
		.always( function(){
			$("#loader").fadeOut();
		});

	}

//---------------- FUNCION PARA MOSTRAR EL DETALLE DE LA SOLICITUD ACEPTADA POR EL CLIENTE INTERNO ---------------------
	$("#tabla-registros").on('click', '.btn-solped', function( e ){
		e.preventDefault();
		var compra_id = $(e.target).closest("a").data("idsolicitud");

		$.ajax(
		{
	        type: 		'GET',
	        url: 		'ws/compras/propuestaceptada',
	        dataType: 	'json',
	        data: 		{compra_id:compra_id},
	        success : function( result )
        	{
				if( result.result )
				{
					$("#form-detalle").html("");
					$('#form-detallesolicitud').remove();

					$('#compra_id_detalle').val(result.records.id);
					$('#propuesta_id_detalle').val(result.records.propuesta.id)

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

					$("#tipo_compra").text("Necesidad: "+tipo);

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

					if( result.records.adjunto != ''){
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
					
					//propuesta aceptada
					
					$('#detallePropuesta').html('');

					var propuesta = result.records.propuesta;
					var detallesDetalle = jQuery.parseJSON(propuesta.detalles);
					var detallePropuesta = '<form class="form-horizontal"><fieldset>'+
												'<legend>Propuesta aceptada: <strong>'+parseInt(result.records.proveedor.codigo)+' - '+result.records.proveedor.proveedor+'</strong></legend>'+
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
				    									'<input class="form-control" value="'+propuesta.monto+'" disabled>'+
				    								'</div>'+
												'</div>'+
												'<div class="form-group">'+
													'<div class="col-sm-2"></div>'+
													'<label class="control-label col-sm-2">Observaciones:</label>'+
													'<div class="col-sm-6">'+
				    									'<textarea class="form-control" rows="3" disabled>'+propuesta.descripcion+'</textarea>'+
				    								'</div>'+
												'</div>'+
												'<div class="form-group">'+
													'<div class="col-sm-2"></div>'+
													'<label class="control-label col-sm-2">Adjunto:</label>'+
													'<div class="col-sm-6">'+
														'<a class="btn btn-success" href="'+propuesta.adjunto+'" download title="Adjunto">Archivo adjunto</a>'+
				    								'</div>'+
												'</div>'+
											'</fieldset></form>';


					$('#detallePropuesta').append(detallePropuesta);

					if(result.records.estado == 2){
				    	$("#detallePropuesta").removeClass('hidden')
				    }
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

//--------------------------------------FUNCION ENVIAR A SAP LA SOLICITUD Y GENERAR SOLPED----------------------------
	function generarSolped(){
		$("#loader").show();

        var propuesta_id = $('#propuesta_id_detalle').val();
        var compra_id = $('#compra_id_detalle').val();

        $.ajax({
            url:        'ws/compras/generarsolped',
            type:       'POST',
            dataType:   'json',
            data:       {propuesta_id:propuesta_id, compra_id:compra_id, aprobacion:1}
            }
        )
        .done(function(data){       
            if( data.result ){
            	$('#modal-detalle').modal('hide');
                $('#nosolped').text(data.records);
                $('#modal-solpedgenerado').modal('show');
            }
            else
            	toastr['error'](result.message, 'Error');

        })
        .fail(function(err){
            console.log(err);
        })
        .always( function(){
            $("#loader").fadeOut();
        });
	}

//--------------------------------------FUNCION PARA QUE EL COMPRAR RECHACE LA SOLICITUD----------------------------
	function rechazarSolicitud(){

		if( $( '#form-rechazar' ).valid() ){

			$("#loader").show();
			
			$.ajax
			({
				type:		"POST",
				url: 		'ws/compras/aprobacionescomprador',
				dataType: 	'json',
				data: 		$('#form-rechazar').serialize(),
				success: function( result )
				{
					if( result.result ){
						$('#modal-rechazar').modal('hide');
						llenarTabla();
						toastr['success'](result.message, 'Éxito');
					}	
					else
						toastr['error'](result.message, 'Error');
				},
				error: function( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			})
			.always( function(){
				$("#loader").fadeOut();
			});
		}
	}
});