	var json = [];
jQuery(document).ready(iniciar);
function iniciar()
{
	var Cantidad=0;
	jQuery('#loader').show();
	window.tabla_BD = jQuery('#tabla-registros').DataTable(
		{
		"order": [[ 8, "desc" ]],
		"columnDefs": [
            {
                "targets": [ 8 ],
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

    jQuery.ajax({
        type:       'GET',
        url:        'ws/sociedad/usuarios',
        dataType:   'json',
    })
    .done(function(data){
        if( data.result )
        {
            jQuery('#pais_codigo').val(data.records.LAND1);
            if( jQuery('#pais_codigo').val()=='GT' ){
                jQuery('#pais_nombre').val('Guatemala');
                jQuery('.documento').text('NIT');
                jQuery('.gt').show();
            }
            if( jQuery('#pais_codigo').val()=='CR' ){
                jQuery('#pais_nombre').val('Costa Rica');
                jQuery('.documento').text('Número de Cédula');
                jQuery('.gt').hide();
            }
            BD_Cargar();
        }
        else
            toastr['error'](data.message, 'Error');
    }).fail(function(err){
        console.log('Pais no se detectó');
    });



	function BD_Cargar(){console.log('BD Cargada Exitosamente');
		window.tabla_BD.clear().draw();
		jQuery.ajax({
			url:'ws/travel/gastos/listar',	
			type:'POST', 	
			dataType: 'json',
			data : {usuario: localStorage.USUARIO},
		}).done(function( data ){
			var consulta=data.records;
			// console.log(consulta);	
			var contar = (consulta.length-1);
			if( contar >= 0 )
				jQuery.each(consulta, function (index, valor) { 

					jQuery.ajax({
				        type:       'GET',
				        url:        'ws/travel/cuentas/detalles',
				        dataType:   'json',
				    })
				    .done(function(dat){
				    	var consult=dat.records;
				        if( dat.result )
				        {	
				        	var conta = (consult.length-1);
				        	var row4='';
				        	jQuery.each(consult, function (inde, valo) { 
				        		if( valor.cnta_gasto == valo.id ){
					           		row4 = valo.nombre;

				        		}

				        		if(inde==conta){
				        			if(row4=='')
				        				row4='Sin Asignar';

				        			if(valor.moneda==0)
				        				valor.moneda='$';
				        			else
				        				if(valor.moneda==1)
				        					valor.moneda='₡';
				        				else
				        					valor.moneda='Q';
				        			row1 = '<strong>'+valor.correlativo+'</strong>';
									row2 = valor.documento;
									row3 = valor.ceco;
				        			row5 = valor.moneda+'. '+valor.monto;
					           		row6 = valor.moneda+'. '+valor.monton;
					           		row7 = parseFloat(valor.monto)-parseFloat(valor.monton);
					           		if(row7<0)
					           			row7 = '<span style="font-size: 1.2em;" class="label label-danger col-md-12"> '+valor.moneda+'. '+row7+'</span>';
					           		else
					           			row7 = '<span style="font-size: 1.2em;" class="label label-success col-md-12"> '+valor.moneda+'. '+row7+'</span>';

					           		row8 = '<a data-placement="top" title="Ver" class="toltip btn-ver btn btn-info btn-xs" href="#modal-ver" data-toggle="modal" data-gasto="'+row4+'" data-id="'+valor.id+'"><i class="fa fa-eye"></i> Ver</a>';
					           		row9 = valor.updated_at;
					           		window.tabla_BD.row.add([row1,row2,row3,row4,row5,row6,row7,row8,row9]).draw(false);
					           		row4='';
					           		if(contar == index)
										jQuery('#loader').hide();
				        		}
					           // row4 = valor.justificacion;
				        	});
				        }
				        else{
				        	jQuery('#loader').hide();
				            toastr['error'](dat.message, 'Error');
				        }
				    }).fail(function(err){
				    	jQuery('#loader').hide();
				        console.log('Pais no se detectó');
				    });
				});
			else{
				toastr['success']('No hay gastos aprobados', 'Éxito');
				jQuery('#loader').hide();
			}


		})
		.fail(function(error){console.log('error: ');console.log(error);jQuery('#loader').hide();})
	}

	jQuery('#btn-guardar').on('click', function(e){
		e.preventDefault();
		jQuery('#loader').show();
		if( jQuery('#codigo').val() ){
			console.log(jQuery('#liquidacion').val()+' ** '+jQuery('#codigo').val());
			jQuery.ajax({
				url:'ws/travel/liquidacion/codigo',	
				type:'POST', 	
				dataType: 'json',
				data : {id_liquidacion: jQuery('#liquidacion').val(), sticker: jQuery('#codigo').val() }
			}).done(function( data ){
				if(data.result){
					BD_Cargar();
		            toastr['success']('Se guardó el código correctamente', 'Éxito');
		            jQuery('#loader').fadeOut();
					jQuery('#modal-ver').modal('hide');
		        }else{
		            toastr['error'](data.message, 'Error');
		            jQuery('#loader').fadeOut();
		        }
			}).fail(function(error){
				console.log(error);
				toastr['error'](error.message, 'Error');
		        jQuery('#loader').fadeOut();
			});
		}else{
			toastr['warning']('No ha ingresado el código', 'Cuidado');
		}
	})
	

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
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------->BOTONES
	jQuery('#tabla-registros').on('click','a.btn-ver',function(e){
		e.preventDefault();
		jQuery('#loader').show();
		var id = jQuery(this).data('id');
		var cnta_gasto = jQuery(this).data('gasto');
		jQuery('#codigo').val('');

		jQuery.ajax({
			url:'ws/travel/gastos/listar/liquidacion',	
			type:'POST', 	
			dataType: 'json',
			data : {id: id},
		}).done(function( data ){
			var consulta=data.records;	
			console.log(consulta);
			// Liquidaciones
			jQuery('#liquidacion').val(consulta.gasto.id);
			jQuery('#l_correlativo').text('Liquidacion #TL-'+consulta.liquidacion.id);
			jQuery('#fecha_finalizacion').text(formato_fecha(consulta.liquidacion.fecha_finalizacion));
			jQuery('#fecha_liquidacion').text(formato_fecha(consulta.liquidacion.fecha_liquidacion));
			jQuery('#tipo').text(consulta.liquidacion.tipo);
			jQuery('#nombre_creo').text(consulta.liquidacion.nombre_creo);
			jQuery('#justificacion').text(consulta.liquidacion.justificacion);
			// gasto
			jQuery('#g_encabezado').text('Gasto #'+consulta.gasto.correlativo);
			jQuery('#ceco').text(consulta.gasto.ceco);
			jQuery('#documento').text(consulta.gasto.documento);
			jQuery('#monto').text(parseFloat(consulta.gasto.monto).toFixed(2));
			jQuery('#monton').text(parseFloat(consulta.gasto.monton).toFixed(2));
			jQuery('#codigo_tributario').text(consulta.gasto.codigo_tributario);
			jQuery('#orden').text(consulta.gasto.orden);
			jQuery('#cnta_gasto').text(cnta_gasto);
			jQuery('#factura').text(consulta.gasto.factura);
			jQuery('#fecha').text(formato_fecha(consulta.gasto.fecha));
			jQuery('#impuesto').text(consulta.gasto.impuesto);
			jQuery('#isr').text(parseFloat(consulta.gasto.isr).toFixed(2));
			jQuery('#retencion_monto').text(parseFloat(consulta.gasto.retencion_monto).toFixed(2));
			jQuery('#retencion_numero').text(consulta.gasto.retencion_numero);
			jQuery('.thumbnail').remove();
			jQuery('#g_foto').append('<a class="thumbnail" href="'+consulta.gasto.foto+'" target="_blank"><img src="'+consulta.gasto.foto+'" alt="Little Egret" width="60%" height="60%" border="0"></a>');

			switch(consulta.gasto.moneda){
				case '0': 	jQuery('.g_moneda').text('$.'); 	break;
				case '1': 	jQuery('.g_moneda').text('₡.'); 	break;
				case '2': 	jQuery('.g_moneda').text('Q.'); 	break;
			}

			// if(consulta.estado == 5)
			// 	jQuery('#rechazado').hide();
			// else
			// 	jQuery('#rechazado').show();

			// jQuery('#fecha_finalizacion').text(formato_fecha(consulta.fecha_finalizacion));
			// jQuery('#fecha_liquidacion').text(formato_fecha(consulta.fecha_liquidacion));
			// jQuery('#tipo').text(consulta.tipo);
			// jQuery('#monton').text(consulta.monto.toFixed(2));
			// jQuery('#justificacion').text(consulta.justificacion);
			// jQuery('#comentario_rechazado').text(consulta.comentario_rechazado);
			// jQuery('#coment').val('');
			// // Gastos
			// jQuery('.gas-todos').remove();
			// switch( jQuery('#pais_codigo').val() ){
	  //           case 'CR':
	  //               var doc = 'Número de Cédula';
	  //               var ver = 'none';
	  //           break;
	  //           case 'GT':
	  //               var doc = 'NIT';
	  //               var ver = 'block';
	  //           break;
	  //       }
	  //       if(consulta.detalle_gastos.length>0){
	  //       	var conteo = consulta.detalle_gastos.length-1;
	  //       	jQuery.each(consulta.detalle_gastos, function (index, valor) { 
	  //       		if( valor.estado == 2 )
	  //       			var est='<span style="font-size: 0.5em;" class="label label-danger">Reenviada</span>';
	  //       		else
	  //       			if( valor.estado == 1 )
	  //       				var est='<span style="font-size: 0.5em;" class="label label-success">Aprobada</span>';
	  //       			else
	  //       				var est='';

			// 		jQuery.ajax({
			// 	        type:       'GET',
			// 	        url:        'ws/travel/cuentas/detalles',
			// 	        dataType:   'json',
			// 	    })
			// 	    .done(function(data){
			// 	    	var encuentro=0;
			// 	    	var contar=data.records.length-1;
			// 	    	jQuery.each(data.records, function (index_GASTO, valor_gasto){
			// 	    		if(valor_gasto.id == valor.cnta_gasto){
			// 	    			valor.cnta_gasto=valor_gasto.nombre;
			// 	    			encuentro=1;
			// 	    		}
			// 	    		if(contar == index_GASTO && encuentro==0)
			// 	    			valor.cnta_gasto='Sin Asignar';

			// 	    		if(contar == index_GASTO){
			// 	    			jQuery('#gastos').append(''+
			// 						'<div class="panel panel-info gas-todos">'+
			// 							'<div class="panel-heading" style="font-size: 1.6em;">'+
			// 								'<input id="'+index+'" type="checkbox" />'+
			// 						  			'<label for="'+index+'" class="checkbox" data-index="'+index+'" data-id="'+valor.id+'">Gasto #'+valor.correlativo+'      '+est+
			// 						  		'</label>'+
			// 							'</div>'+
			// 							'<div class="panel-body">'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> CECO #</span>'+
			// 								  		'<input type="text" name="ceco_" id="ceco_'+valor.id+'" class="form-control cambiar"  data-id="'+valor.id+'" data-tipo="ceco" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
			// 								  		'<input style="display: none;" type="hide" name="ceco_" id="cecob_'+valor.id+'" class="form-control " placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Monto '+jQuery('#moneda').text()+'</span>'+
			// 								  		'<input type="text" name="monton_" id="monton_'+valor.id+'" class="form-control cambiar"  data-id="'+valor.id+'" data-tipo="monton" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
			// 								  		'<input style="display: none;" type="hide" name="monton_" id="montonb_'+valor.id+'" class="form-control" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" ></div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info">'+doc+'</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Cantidad" aria-describedby="basic-addon1" >'+valor.documento+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Cód. Tributario</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1">'+valor.codigo_tributario+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" ></div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Órden</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.orden+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Cnta. gasto</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.cnta_gasto+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" ></div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Factura #</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.factura+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Fecha</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.fecha+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" ></div>'+
			// 								'<div class="col-lg-6">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Impuesto</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.impuesto+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6" style="display: '+ver+';">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> ISR </span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.isr+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" style="display: '+ver+';"></div>'+
			// 								'<div class="col-lg-6" style="display: '+ver+';">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Retención #</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_numero+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="col-lg-6" style="display: '+ver+';">'+
			// 									'<div class="input-group">'+
			// 										'<span class="input-group-addon btn-info"> Retención '+jQuery('#moneda').text()+'</span>'+
			// 								  		'<span type="text" class="form-control" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_monto+'</span>'+
			// 									'</div>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12" ></div>'+
			// 								'<div class="form-group col-md-12" >'+
			// 									'<a class="thumbnail" href="'+valor.foto+'" target="_blank"><img src="'+valor.foto+'" alt="Little Egret" width="60%" height="60%" border="0"></a>'+
			// 								'</div>'+
			// 								'<div class="form-group col-md-12 guardar" style="display: none;" id="guardar_'+valor.id+'">'+
			// 									'<button type="button" class="btn btn-primary btn-block guardar" data-id="'+valor.id+'"> Guardar cambios </button>'+
			// 								'</div>'+
											
			// 							'</div>'+
			// 						'</div>'+
			// 						'');
			// 	    			if(conteo == index)
			// 	    				jQuery('#loader').hide();
			// 	    		}

			// 	    	});
			// 	    }).fail(function(err){
			// 	        console.log('Pais no se detectó');
			// 	    });
			// 	});
	  //       }
	  //       else{
	  //       	jQuery('#gastos').append(''+
	  //       		'<div style="font-size: 1.2em;"" class="alert alert-info" role="alert"><center>No hay Gastos para esta liquidacion</center></div>'+
	  //       	'');
	        	jQuery('#loader').hide();
	  //       }

				
		})
		.fail(function(error){console.log('error: ');console.log(error);})
	});

}
