	var json = [];
jQuery(document).ready(iniciar);
function iniciar()
{
	var Cantidad=0;
	window.tabla_BD = jQuery('#tabla-registros').DataTable(
		{
		"order": [[ 10, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 10 ],
                "visible": false,
                "searchable": false
            }
        ],
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
    var idEliminar='';
	var idRegistro='';
	jQuery('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    BD_Cargar();

	function BD_Cargar(){
		jQuery('#loader').show();
		window.tabla_BD.clear().draw();
		jQuery.ajax({
			url:'ws/travel/liquidaciones/anticipos',	
			type:'POST', 	
			dataType: 'json',
			data : {usuario: jQuery('#buscar').val()},
		}).done(function( data ){
			if(data.result){
				//console.log(data.records);
				var consulta=data.records;	
				var contar = consulta.length-1;
				jQuery.each(consulta, function (index, valor) { 
						if(valor.tipo_moneda==0)
				        				var mon='Dólares';
				        			else
				        				if(valor.tipo_moneda==1)
				        					var mon='Colones';
				        				else
				        					var mon='Quetzales';

	                    if(valor.estado==0) {
				        				var estado='Pendiente'; valor.fecha=' - - - - - - - - - - '; 
				        			}else
				        				if(valor.estado==1) {
				        					var estado = 'Aprobada';
				        				}
				        				else
				        					if(valor.estado==2) {
				        						var estado = 'Rechazada'; valor.fecha=' - - - - - - - - - - ';
				        					}
				        					else {
				        					 	var estado = 'Liquidada';
				        					}
	                    //console.log(valor.jefe);
						row1='<center>'+valor.correlativo+'</center>';
						row6 = estado;
						ceco = valor.centro_costo_numero;
						row5 = valor.nombre_usuario;
						if(valor.jefe == "")
							row11 = " - - - - - - - - - - ";
						else
						row11 = valor.jefe;
						row8 = valor.cuenta_gasto;
						row2=  formato_fecha(valor.fecha_entrega);
						row9=  valor.fecha;
						row3 = valor.monto;
						row4 = mon;
						row10 = valor.justificacion;
						// row6 = '<a data-placement="top" title="Visualizar detalles" class="toltip btn-ver btn btn-info btn-xs" href="#modal-ver" data-toggle="modal" data-id="'+valor.id+'"><i class="fa fa-eye"></i></a> '+
								// ' <a data-placement="top" title="Ingresar el codigo" class="toltip btn-exportar btn btn-success btn-xs" data-id="'+valor.id+'"><i class="fa fa-file-excel-o"></i></a>';
						row7 = valor.updated_at;
		                window.tabla_BD.row.add([row1,row6,ceco,row5,row11,row3,row4,row10,row2,row9,row7]).draw(false);
					// }
					if( index == contar )
						jQuery('#loader').fadeOut();

						
				});
			}else{
				toastr['success']('No hay anticipos disponibles', 'Éxito');
			}
				
		})
		.fail(function(error){console.log('error: ');console.log(error);})
		.always(function(error){jQuery('#loader').hide();})
		
	};

	// jQuery('#tabla-registros').on('click', '.exportar', function(){
	jQuery('#btn-exportar').on('click',function(e){
		e.preventDefault();
		window.location.href = "ws/travel/liquidaciones/saldos/exportar";
		toastr["success"]("Exportado correctamente", "Éxito");
	});

	// jQuery.ajax({
 //        type:       'GET',
 //        url:        'ws/sociedad/usuarios',
 //        dataType:   'json',
 //    })
 //    .done(function(data){
 //        if( data.result )
 //        {
 //            jQuery('#pais_codigo').val(data.records.LAND1);
 //            if( jQuery('#pais_codigo').val()=='GT' )
 //                jQuery('#pais_nombre').val('Guatemala');
 //            if( jQuery('#pais_codigo').val()=='CR' )
 //                jQuery('#pais_nombre').val('Costa Rica');
 //        }
 //        else
 //            toastr['error'](data.message, 'Error');
 //    }).fail(function(err){
 //        console.log('Pais no se detectó');
 //    });

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------>FUNCIONES
	function formato_fecha(id){
		var A=new Date(Date.parse(id)).getFullYear();
	    var M=new Date(Date.parse(id)).getMonth()+1;
	    var D=new Date(Date.parse(id)).getDate()+1;
	    if(M<10)
	        M='0'+M;
	    if(D<10)
	        D='0'+D;
	    var fecha=D+'/'+M+'/'+A;
	    return fecha;
	}
	function separador_miles_decimales(id){
	    var valor=id.toString();
	    //console.log(valor);
	    var valor=valor.replace(/,/gi, " ");
	    Cantidad=generador.call(valor.split(' ').join(''),' ','.');
	}
	function generador(comma, period) {
	    comma = comma || ',';
	    period = period || '.';
	    var split = this.toString().split('.');
	    var numeric = split[0];
	    var decimal = split.length > 1 ? period + split[1] : '';
	    var reg = /(\d+)(\d{3})/;
	    while (reg.test(numeric)) 
	    {
	        numeric = numeric.replace(reg, '$1' + comma + '$2');
	    }
	    /*body = a.toFixed(2);  */
	    var total=0;
	    if(decimal.length>1)
	    {
	        if(decimal.length>3){
	            decimal_pruebas=parseFloat(decimal);
	            decimal_pruebas = decimal_pruebas.toFixed(2);
	            decimal_pruebas >=1?decimal_pruebas = 0.99 :decimal_pruebas=decimal_pruebas;
	            decimal_pruebas = decimal_pruebas.toString();
	            decimal= decimal_pruebas.replace(/0./gi, ".");
	            //console.log(decimal_pruebas);
	        }
	        numeric=numeric.replace(/ /gi, ",");
	        total=numeric+decimal;
	    }else{
	        numeric=numeric.replace(/ /gi, ",");
	        total=numeric+decimal;
	    }
	    return total;
	}

	// jQuery('#gastos').on('click', '.guardar', function(){//----------------------------------------------------->guarda la información de los gastos
	//     jQuery('#loader').show();
	// 	var id = jQuery(this).data('id');
	// 	jQuery('#monton_'+id).val();
	// 	jQuery('#ceco_'+id).val();

	// 	if(jQuery('#ceco_'+id).val()  && jQuery('#monton_'+id).val()){
	// 		jQuery.ajax({
	// 			url:'ws/travel/sociedadceco',	
	// 			type:'POST', 	
	// 			dataType: 'json',
	// 			data : { ceco: jQuery('#ceco_'+id).val() },
	// 		}).done(function( data ){
	// 			if(data.result){
	// 	            jQuery.ajax({
	// 					url:'ws/travel/gastos/modificar',	
	// 					type:'POST', 	
	// 					dataType: 'json',
	// 					data : {id_gasto: id, ceco: jQuery('#ceco_'+id).val(), monton: jQuery('#monton_'+id).val() },
	// 				}).done(function( data ){
	// 					if(data.result){
	// 						jQuery('#cecob_'+id).val(jQuery('#ceco_'+id).val());
	// 						jQuery('#montonb_'+id).val(jQuery('#monton_'+id).val());
	// 						jQuery('#guardar_'+id).hide();

	// 			            toastr['success']('Se guardaron los cambios en el gasto #TG-'+id, 'Éxito');
	// 			            jQuery('#loader').fadeOut();
	// 			        }else{
	// 			            toastr['error'](data.message, 'Error');
	// 			            jQuery('#loader').fadeOut();
	// 			        }
	// 				}).fail(function(error){
	// 					console.log(error);
	// 					toastr['error'](error.message, 'Error');
	// 			        jQuery('#loader').fadeOut();
	// 				});
	// 	        }else{
	// 	            toastr['error']('El CECO ingresado en el gasto #TG-'+id+' no existe', 'Error');
	// 	            jQuery('#loader').fadeOut();
	// 	        }
	// 		}).fail(function(error){
	// 			console.log(error);
	// 			toastr['error'](error.message, 'Error');
	// 	        jQuery('#loader').fadeOut();
	// 		});
	// 	}
	// })

	// jQuery('#gastos').on('click', '.checkbox', function(){//---------------------------------------------------->agrega o quita los id de los gastos en el json
	// 	var id = jQuery(this).data('id');
	// 	var index = jQuery(this).data('index');
		
	// 	if( jQuery('#'+index).is(':checked') ){
	//         // Hacer algo si el checkbox ha sido desseleccionado
	//         jQuery.each(json, function (ind, valor) { 
	//         	if(valor)
	//         		if(valor.id == id){
	//         			delete json[ind];
	//         		}
	//         });
	//     } else {
	//         console.log(json);
	//         // Hacer algo si el checkbox ha sido seleccionado
	//         json.push({'id': id});
	//     }
	// });

	// jQuery('#gastos').on('keyup', '.cambiar', function(){//----------------------------------------------------->esconder o aparecer el boton de guardar
	// 	var id = jQuery(this).data('id');
	// 	var tipo = jQuery(this).data('tipo');

	// 	if(( jQuery('#ceco_'+id).val() != jQuery('#cecob_'+id).val() ) || ( jQuery('#monton_'+id).val() != jQuery('#montonb_'+id).val() ))
	// 		jQuery('#guardar_'+id).show();
	// 	else
	// 		jQuery('#guardar_'+id).hide();
	// });

	// jQuery('#btn-aprobar').on('click', function(e){//----------------------------------------------------------->aprobar liquidacion
	// 	e.preventDefault();
	// 	jQuery('#loader').show();
	// 	if( jQuery('.guardar').is(":visible") ){
	// 		toastr['error']('Aun hay cambios que no se han guardado', 'Error');
	// 	}else{
	// 		jQuery('#tipos').val('1');
	// 		if( json )
	// 			var jsons = JSON.stringify(json);
	// 		else
	// 			var jsons = [{}];

	// 		console.log(jsons);
	// 		jQuery.ajax({
	// 			url:'ws/travel/liquidacion/pendientes',	
	// 			type:'POST', 	
	// 			dataType: 'json',
	// 			data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipos').val(), comentario_rechazado: jQuery('#comentario_rechazado').text(), json: jsons },
	// 		}).done(function( data ){
	// 			if(data.result){
	// 				BD_Cargar();
	// 	            toastr['success']('Los gastos seleccionados se han aprobado', 'Éxito');
	// 	            jQuery('#loader').fadeOut();
	// 				jQuery('#modal-ver').modal('hide');
	// 	        }else{
	// 	            toastr['error'](data.message, 'Error');
	// 	            jQuery('#loader').fadeOut();
	// 	        }
	// 		}).fail(function(error){
	// 			console.log(error);
	// 			toastr['error'](error.message, 'Error');
	// 	        jQuery('#loader').fadeOut();
	// 		});
	// 	}
	// });

	// jQuery('#btn-rechazar').on('click', function(e){//---------------------------------------------------------->rechazar liquidación
	// 	e.preventDefault();

	// 	if( jQuery('.guardar').is(":visible") ){
	// 		toastr['error']('Aun hay cambios que no se han guardado', 'Error');
	// 	}else{
	// 		if( json.length>0 ){
	// 			jQuery('#tipos').val('2');
	// 			jQuery('#modal-rechazar').modal('show');
	// 			jQuery('#modal-ver').modal('hide');
	// 		}else{
	// 			toastr['warning']('No ha seleccionado los gastos para eliminar', 'Cuidado');
	// 		}
	// 	}
	// });

	// jQuery('#btn-rechazar-enviar').on('click', function(e){//--------------------------------------------------->enviar el rechazo 
	// 	e.preventDefault();

	// 	if( jQuery('#coment').val() ){
	// 		var jsons = JSON.stringify(json);
	// 		jQuery.ajax({
	// 			url:'ws/travel/liquidacion/pendientes',	
	// 			type:'POST', 	
	// 			dataType: 'json',
	// 			data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipos').val(), comentario_rechazado: jQuery('#coment').text(), json: jsons },
	// 		}).done(function( data ){
	// 			if(data.result){
	// 				BD_Cargar();
	// 	            toastr['success']('Los gastos se rechazarón correctamente', 'Éxito');
	// 	            jQuery('#loader').fadeOut();
	// 				jQuery('#modal-rechazar').modal('hide');
	// 	        }else{
	// 	            toastr['error'](data.message, 'Error');
	// 	            jQuery('#loader').fadeOut();
	// 	        }
	// 		}).fail(function(error){
	// 			console.log(error);
	// 			toastr['error'](error.message, 'Error');
	// 	        jQuery('#loader').fadeOut();
	// 		});
	// 	}else{
	// 		toastr['warning']('Hace falta el comentario de rechazo', 'Cuidado');
	// 	}
		
	// });
	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------->BOTONES
	jQuery('#tabla-registros').on('click','a.btn-ver',function(e){
		e.preventDefault();
		json = [];
		jQuery('#loader').show();
		var id = jQuery(this).data('id');

		jQuery.ajax({
			url:'ws/travel/liquidacion/detalles',	
			type:'POST', 	
			dataType: 'json',
			data : {id_liquidacion: id},
		}).done(function( data ){
			var consulta=data.records;	
			//Liquidaciones
			jQuery('#id_liquidacion').val(id);
			jQuery('#myModalLabel').text('Liquidación de gastos #'+consulta.correlativo);
			
			switch(consulta.moneda){
				case '0': 	jQuery('#moneda').text('$.'); 	break;
				case '1': 	jQuery('#moneda').text('₡.'); 	break;
				case '2': 	jQuery('#moneda').text('Q.'); 	break;
			}
			if(consulta.estado == 5)
				jQuery('#rechazado').hide();
			else
				jQuery('#rechazado').show();

			jQuery('#fecha_finalizacion').text(formato_fecha(consulta.fecha_finalizacion));
			jQuery('#fecha_liquidacion').text(formato_fecha(consulta.fecha_liquidacion));
			jQuery('#tipos').text(consulta.tipo);
			console.log(consulta.tipo);
			jQuery('#monton').text(consulta.monto.toFixed(2));
			jQuery('#justificacion').text(consulta.justificacion);
			// Gastos
			jQuery('.gas-todos').remove();
			switch( jQuery('#pais_codigo').val() ){
	            case 'CR':
	                var doc = 'Número de Cédula';
	                var ver = 'none';
	            break;
	            case 'GT':
	                var doc = 'NIT';
	                var ver = 'block';
	            break;
	        }
	        if(consulta.detalle_gastos.length >0){
	        	var conteo = consulta.detalle_gastos.length-1;
	        	jQuery.each(consulta.detalle_gastos, function (index, valor) { 
	        		if( valor.estado == 2 )
	        			var est='<span style="font-size: 0.5em;" class="label label-danger">Reenviada</span>';
	        		else
	        			if( valor.estado == 1 )
	        				var est='<span style="font-size: 0.5em;" class="label label-success">Aprobada</span>';
	        			else
	        				var est='<span style="font-size: 0.5em;" class="label label-danger">Rechazada</span>';

					jQuery.ajax({
				        type:       'GET',
				        url:        'ws/travel/cuentas/detalles',
				        dataType:   'json',
				    })
				    .done(function(data){
				    	var encuentro=0;
				    	var contar=data.records.length-1;
				    	jQuery.each(data.records, function (index_GASTO, valor_gasto){
				    		if(valor_gasto.id == valor.cnta_gasto){
				    			valor.cnta_gasto=valor_gasto.nombre;
				    			encuentro=1;
				    		}
				    		if(contar == index_GASTO && encuentro==0)
				    			valor.cnta_gasto='Sin Asignar';

				    		if(contar == index_GASTO ){
				    			jQuery('#gastos').append(''+
									'<div class="panel panel-info gas-todos">'+
										'<div class="panel-heading" style="font-size: 1.6em;">'+
											'<input id="'+index+'" type="hidden" />'+
									  			'<label for="'+index+'" class="checkbox" data-index="'+index+'" data-id="'+valor.id+'">Gasto #'+valor.correlativo+'      '+est+
									  		'</label>'+
										'</div>'+
										'<div class="panel-body">'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> CECO #</span>'+
											  		'<input type="text" name="ceco_" id="ceco_'+valor.id+'" class="form-control cambiar"  data-id="'+valor.id+'" data-tipo="ceco" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
											  		'<input style="display: none;" type="hide" name="ceco_" id="cecob_'+valor.id+'" class="form-control " placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Monto '+jQuery('#moneda').text()+'</span>'+
											  		'<input type="text" name="monton_" id="monton_'+valor.id+'" class="form-control cambiar"  data-id="'+valor.id+'" data-tipo="monton" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
											  		'<input style="display: none;" type="hide" name="monton_" id="montonb_'+valor.id+'" class="form-control" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info">'+doc+'</span>'+
											  		'<span type="text" class="form-control" placeholder="Cantidad" aria-describedby="basic-addon1" >'+valor.documento+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Cód. Tributario</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1">'+valor.codigo_tributario+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Órden</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.orden+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Cnta. gasto</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.cnta_gasto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Factura #</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.factura+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Fecha</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+formato_fecha(valor.fecha)+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Impuesto</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.impuesto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> ISR </span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.isr+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" style="display: '+ver+';"></div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Retención #</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_numero+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Retención '+jQuery('#moneda').text()+'</span>'+
											  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_monto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="form-group col-md-12" >'+
												'<a class="thumbnail" href="'+valor.foto+'" target="_blank"><img src="'+valor.foto+'" alt="Little Egret" width="60%" height="60%" border="0"></a>'+
											'</div>'+
											'<div class="form-group col-md-12 guardar" style="display: none;" id="guardar_'+valor.id+'">'+
												'<button type="button" class="btn btn-primary btn-block guardar" data-id="'+valor.id+'"> Guardar cambios </button>'+
											'</div>'+
											
										'</div>'+
									'</div>'+
									'');
				    			if(conteo == index)
				    				jQuery('#loader').hide();
				    		}

				    	});
				    }).fail(function(err){
				        console.log('Pais no se detectó');
				    });
				});
	        }
	        else{
	        	jQuery('#gastos').append(''+
	        		'<div style="font-size: 1.2em;"" class="alert alert-info" role="alert"><center>No hay Gastos para esta liquidacion</center></div>'+
	        	'');
	        	jQuery('#loader').hide();
	        }

				
		})
		.fail(function(error){console.log('error: ');console.log(error);})
	});

	// jQuery('#tabla-registros').on('click','a.btn-ingresar',function(e){
	// 	e.preventDefault();
	// 	var id = jQuery(this).data('id');
	// 	jQuery('#id_liquidacion').val(id);
	// });

	// jQuery('#btn-codigo').on('click', function(e){
	// 	e.preventDefault();

	// 	if( jQuery('#codigo').val() ){
	// 		var jsons = JSON.stringify(json);
	// 		jQuery.ajax({
	// 			url:'ws/travel/liquidacion/codigo',	
	// 			type:'POST', 	
	// 			dataType: 'json',
	// 			data : {id_liquidacion: jQuery('#id_liquidacion').val(), sticker: jQuery('#codigo').val() },
	// 		}).done(function( data ){
	// 			if(data.result){
	// 				BD_Cargar();
	// 	            toastr['success']('Su código se ingreso correctamente', 'Éxito');
	// 	            jQuery('#loader').fadeOut();
	// 				jQuery('#modal-ingresar').modal('hide');
	// 	        }else{
	// 	            toastr['error'](data.message, 'Error');
	// 	            jQuery('#loader').fadeOut();
	// 	        }
	// 		}).fail(function(error){
	// 			console.log(error);
	// 			toastr['error'](error.message, 'Error');
	// 	        jQuery('#loader').fadeOut();
	// 		});
	// 	}else{
	// 		toastr['warning']('Hace falta el código', 'Cuidado');
	// 	}
	// });

}
