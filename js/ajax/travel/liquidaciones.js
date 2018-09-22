var uid_usuario = '';
var liquidacion_id = 0;
var array_index = 0;
var liquidaciones = new Array();
var ceco_validacion=true;
var orden_validacion=true;
var validacion_rechazo=0;
var array = new Array();
var gastos_origen = new Array();
jQuery( document ).ready( function( $ )
{ 
	$('#loader').show();
	window.tabla_registros = jQuery('#tabla-registros').DataTable({
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

	$('.input-date-picker').datepicker({
		format: 'dd-mm-yyyy',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

	// Initial functions
	uid_usuario = localStorage.USUARIO.toUpperCase();
    cargarDatosUsuario(uid_usuario);
	loadData();
	delegates(uid_usuario);

	// Events
	$('#usuarios').on('change', changeUser);
	$('#tabla-registros').on('click', 'a.btn-liq-detail', liquidationDetail);
	$('#btn-aprobar').on('click', aprobLiquidation);
	$('#btn-rechazar').on('click', rejectLiquidation);
	$('#btn-send-reject').on('click', sendRejectLiquidation);
	$('#btn-send-aprob').on('click', sendAprobLiquidation);
	// Functions


	function cargarDatosUsuario(usuario)
	{	
	console.log(usuario);
	jQuery.ajax({
		url:        'ws/sap/data/showmember',
	    type:       'GET',
	    dataType:   'json',
	    async: 		false,
	    data: 		{user:usuario}
	})
	.done(function (response) {
		if (response.result) {
			// jQuery('#tarjeta_user').val(response.records.MONIBYTE);
			console.log(response.records);
			localStorage.setItem('TRAVEL_DATOS_USUARIO', JSON.stringify(response.records));
			cargarDatosJefe(usuario);
		} else {
			console.log(response.message);
		}	
	})
	}

	function cargarDatosJefe(usuario)
	{
	jQuery.ajax({
		url:        'ws/concursos/perfil',
	    type:       'GET',
	    dataType:   'json',
	    data: 		{ user:usuario }
	})
	.done(function (response) {
		if (response.result) {
			localStorage.setItem('TRAVEL_DATOS_JEFE', JSON.stringify(response.records.jefe));
		} else {
			console.log(response.message);
		}	
	})
	}


	function loadData()
	{
		$('#loader').show();
		window.tabla_registros.clear().draw();
		$.ajax({
			url: 		'ws/travel/liquidacion/historial/aprobaciones',	
			type: 		'GET', 	
			dataType: 	'json',
			data : 		{usuario_email:uid_usuario},
		})
		.done(function(response) {
			if (response.result) {
				//console.log(response.records);
				if (response.records.length > 0) {
					liquidaciones = response.records;
					$.each(response.records, function (index, value) { 
						row1 = '<center>'+value.correlativo+'</center>';
						row2 = value.nombre_creo;
						row3 = value.tarjeta !== '' ? '<span class="label label-primary"> Monibyte </span>' : '<span class="label label-success"> No monibyte </span>';
						row4 = value.justificacion;
						row5 = formato_fecha(value.fecha_finalizacion);
						row6 = formato_fecha(value.fecha_liquidacion);
						row7 = '<span class="label label-default"> Pendiente </span>';
						row8 = '<a data-placement="top" title="Ver" class="toltip btn btn-info btn-xs btn-liq-detail" href="#modal-ver" data-usuario="'+value.usuario_creo+'" data-toggle="modal" data-id="'+value.id+'" data-index="'+index+'"><i class="fa fa-eye"></i> Ver</a>';
						row9 = value.updated_at;
		                window.tabla_registros.row.add([row1,row2,row3,row4,row5,row6,row7,row8,row9]).draw(false);

					});
					//console.log(response.records);
				} else {
					toastr['success'](response.message, 'Éxito');
				}
			} else {
				toastr['error'](response.message, 'Error');
			}
		})
		.always(function(error){ $('#loader').hide(); })
	}

	function delegates( email )
    { 
        $.ajax({
            type:       'GET',
            url:        'ws/travel/liquidaciones/permisos?email='+email,
            dataType:   'json',
        })
        .done(function(data){
            if (data.result) {
                var bandera = 0;
                $('.usuarios').remove();
                $('#usuarios').append('<option class="usuarios" selected="selected" value="'+localStorage.USUARIO+'">'+localStorage.NOMBRE_USUARIO+'</option>');
                $.each(data.records, function(index, valor) {
                    if (valor.aprobacion == 'true') {
                        bandera = 1;
                        $('#usuarios').append('<option class="usuarios" value="'+valor.email_jefe+'">'+valor.nombre_jefe+'</option>');
                    }
                    
                });
                //console.log(data.records);
            } else{
                toastr['error'](data.message, 'Error');
            }
        }).always( function(){ });  
    }

	function changeUser ()
    {
        uid_usuario = $(this).val();
        loadData(uid_usuario);
        //cargarDatosUsuario(uid_usuario);
    }
    function changeOrden ()
    {
    	var id=$(this).data('id');
        if ($('.orden'+id).val()) {
            $('#btn-buscar-ceco'+id).attr('disabled', 'disabled');
            $('#btn-buscar-ceco'+id).css('pointer-events', 'none');
            $('.ceco'+id).prop('disabled', true);
        } else {
            $('#btn-buscar-ceco'+id).removeAttr('disabled', 'disabled');
            $('.ceco'+id).prop('disabled', false);
            $('#btn-buscar-ceco'+id).css('pointer-events', '');
        }
        orden_validacion=false;
    }
	function changeCeco ()
    {
    	var id=$(this).data('id');
        if ($('.ceco'+id).val()) {
            $('#btn-buscar-orden'+id).attr('disabled', 'disabled');
            $('#btn-buscar-orden'+id).css('pointer-events', 'none');
            $('.orden'+id).prop('disabled', true);
        } else {
            $('#btn-buscar-orden'+id).removeAttr('disabled', 'disabled');
            $('.orden'+id).prop('disabled', false);
            $('#btn-buscar-orden'+id).css('pointer-events', '');
        }
        ceco_validacion=false;
    }
    function searchCeco () 
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        $.ajax({
            url:        'ws/ordenceco/sociedad',
            type:       'GET',
            dataType:   'json',
            data:       {ceco: $('#ceco').val(), orden: $('#orden').val(), sociedad:datos_usuario.SOCIEDAD},
        })
        .done(function (response) {
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                ceco_validacion=true;
            } else {
                toastr['error'](response.message, 'Error');
                ceco_validacion=false;
            }
        });
    }
    function searchOrden () 
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        $.ajax({
            url:        'ws/ordenceco/sociedad',
            type:       'GET',
            dataType:   'json',
            data:       {ceco: $('#ceco').val(), orden: $('#orden').val(), sociedad:datos_usuario.SOCIEDAD},
        })
        .done(function (response) {
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                orden_validacion=true;
            } else {
                toastr['error'](response.message, 'Error');
                orden_validacion=false;
            }
        });
    }
    function liquidationDetail () 
    {
    	$('#loader').fadeOut();
    	$('#gastos-list').html('');
    	liquidacion_id = $(this).data('id');
    	array_index = $(this).data('index');
    	var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
    	$.ajax({
    		type: 		'GET',
    		url: 		'ws/travel/liquidacion/detalles',
    		dataType: 	'json',
    		data: 		{id_liquidacion:liquidacion_id, tarjeta:datos_usuario.MONIBYTE }
    	})
    	.done(function (response) {
    		//console.log(response.records);
    		if (response.result) {
    			gastos_origen = response.records.gastos;
    			//funcion para editar el gasto
    			function editExpense(e){
    				console.log("entro");
    				var validacion_editar = $('.validacion').attr('class');
    				// if ( validacion_editar == 'validacion btn btn-success' ) {
    				// 	toastr['error']('Ya se esta editando un gasto por favor guarde los cambios', 'Error');
    				// } 
    				// else {
					var validacion;
					var id=$(this).data('id');
					validacion= $(this).prop('class');
					if (  validacion == 'validacion btn btn-success'   ) {
						$(this).removeClass('btn-success');
						$(this).addClass('btn-primary');
						$(this).val('Editar Gasto');
		
						$('.ceco'+id).attr('disabled','true');
						$('.monto'+id).attr('disabled','true');
						$('.orden'+id).attr('disabled','true');
						$('.impuesto'+id).attr('disabled','true');
						$('.isr'+id).attr('disabled','true');
						$('.retencion'+id).attr('disabled','true');
						$('.no_retencion'+id).attr('disabled','true');
						data = {
				    		id_gasto: id,
				    		ceco: $('.ceco'+id).val(),
				    		orden: $('.orden'+id).val(),
				    		monton: $('.monto'+id).val(),
				    		impuesto: $('.impuesto'+id).val(),
				    		isr: $('.isr'+id).val(),
				    		no_retencion: $('.no_retencion').val(),
				    		retencion_monto: $('.retencion'+id).val()
				    	};
							$.ajax({
				    			type: 		'POST',
				    			url: 		'ws/travel/gastos/modificar',
				    			dataType: 	'json',
				    			data: 		data
				    		})
				    		.done(function (response) {
				    			if (response.result) {
				                    toastr['success'](response.message, 'Éxito');
				                    //console.log(response.records);
				                    $('#monton').text(response.records.total);
				    			} else {
				    				toastr['error'](response.message, 'Error'); 
				    			}
				    		})
				    		.always(function () {
				    			$('#loader').fadeOut();
				    		});
				    		// }
					} else {
							// $('#no_factura').removeProp('disabled');
							// $('#fecha_factura').removeProp('disabled');
							// $('#cedula').removeProp('disabled');
							// $('#codigo_tributario').removeProp('disabled');
							// $('.ceco'+id).removeAttr('disabled');
							$('.monto'+id).removeAttr('disabled');
							// $('.orden'+id).removeAttr('disabled');
						if (response.records.pais=='GT') {
							$('.isr'+id).removeAttr('disabled');
							$('.retencion'+id).removeAttr('disabled');
							$('.impuesto'+id).removeAttr('disabled');
						} else {
							if (response.records.sociedad == 'FBEB' || response.records.sociedad == 'FRCN') {
								$('.impuesto'+id).attr('disabled','true');
							} else {
								$('.impuesto'+id).removeAttr('disabled');	
							}
						}
						$(this).removeClass('btn-primary');
						$(this).addClass('btn-success');
						$(this).val('Guardar Gasto');
					}
					if ($('.ceco'+id).val() == "") {
						$('.ceco'+id).attr('disabled','true');
					} else {
						$('.orden'+id).attr('disabled','true');
					}
					// }
				}
				moneda = ''; documento = '';
                if (response.records.moneda == 0) 
                    moneda = '$. ';
                else if (response.records.moneda == 1)
                    moneda = '₡. ';
                else
                    moneda = 'Q. ';

                documento = response.records.pais === 'GT' ? 'NIT' : 'Cédula';
                $('#moneda').text(moneda);
				$('#fecha_finalizacion').text((response.records.fecha_finalizacion));
				$('#fecha_liquidacion').text((response.records.fecha_liquidacion));
				$('#tipos').text(response.records.tipo);
				$('#monton').text(response.records.monto);
				$('#justificacion').text(response.records.justificacion);
				$('#comentario_rechazado').text(response.records.comentario_rechazado);
				if (response.records.gastos.length == 0) {
					toastr['error']('No existen gastos asociados', 'Error');
				} else {
					$.each(response.records.gastos, function (index, value) {
						// console.log(value)
						var html = 	'<div class="panel panel-info detail-expense">'+
										'<div class="panel-heading" style="font-size: 1.6em;">'+
											'<input id="'+value.id+'" type="checkbox" data-id="'+value.id+'" class="check-expense"/>'+
									  		'<label for="'+value.id+'" class="checkbox">Gasto #'+value.correlativo+'      '+
									  		'<input type="button" id="btn-editar-gasto" class="validacion btn btn-primary" data-id="'+value.id+'" style="float:right;" value="Editar Gastos"> </label>'+
										'</div>'+
										'<div class="panel-body">'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> CECO #</span>'+
											  		'<input type="number" data-id="'+value.id+'" id="ceco" class="ceco form-control ceco'+value.id+'" aria-describedby="basic-addon1" value="'+value.ceco+'" disabled />'+
											  		'<span id="btn-buscar-ceco" class="input-group-addon btn-danger"> <i id="buscarcecoico" class="fa fa-search"></i> </span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Monto '+moneda+'</span>'+
											  		'<input type="number" class="form-control monto'+value.id+'" aria-describedby="basic-addon1" value="'+value.monton+'" disabled />'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info">'+documento+'</span>'+
											  		'<input type="text"  id="cedula" class="form-control" aria-describedby="basic-addon1" value="'+value.documento+'" disabled />'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Código tributario</span>'+
													'<input id="codigo_tributario" type="text" class="form-control" aria-describedby="basic-addon1" value="'+value.codigo_tributario+'" disabled />'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Órden</span>'+
											  		'<input type="number" id="orden" data-id="'+value.id+'" class="orden form-control orden'+value.id+'" aria-describedby="basic-addon1" value="'+value.orden+'" disabled />'+
											  		'<span id="btn-buscar-orden" class="input-group-addon btn-danger"> <i id="buscarcecoico" class="fa fa-search"></i> </span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Cuenta gasto</span>'+
													'<input class="form-control" aria-describedby="basic-addon1" value="'+value.rubro.nombre+'" disabled />'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info">Número de factura</span>'+
													'<input id="no_factura" class="form-control" aria-describedby="basic-addon1" value="'+value.factura+'" disabled />'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Fecha</span>'+
													'<input class="form-control input-date-picker id="fecha_factura" type="text" aria-describedby="basic-addon1" value="'+value.fecha+'" disabled/>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12"></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Impuesto '+moneda+'</span>'+
													'<input class="form-control impuesto'+value.id+'" type="number" aria-describedby="basic-addon1" value="'+value.impuesto+'" disabled/>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6 GT">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> ISR '+moneda+'</span>'+
													'<input class="form-control isr'+value.id+'" type="number" aria-describedby="basic-addon1" value="'+value.isr+'" disabled/>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12 GT"></div>'+
											'<div class="col-lg-6 GT">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Número de retención</span>'+
													'<input class="form-control no_retencion'+value.id+'" type="number" aria-describedby="basic-addon1" value="'+value.retencion_numero+'" disabled/>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6 GT">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Retención '+moneda+'</span>'+
													'<input class="form-control retencion'+value.id+'" type="number" aria-describedby="basic-addon1" value="'+value.retencion_monto+'" disabled/>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="form-group col-md-12" >'+
												'<a class="thumbnail" href="'+value.foto+'" target="_blank"><img src="'+value.foto+'" alt="Little Egret" width="60%" height="60%" border="0"></a>'+
											'</div>'+
											'<div class="form-group col-md-12 save-update" style="display: none;" data-id="'+value.id+'">'+
												'<button type="button" class="btn btn-primary btn-block btn-save-update" data-id="'+value.id+'"> Guardar cambios</button>'+
											'</div>'+
										'</div>'+
									'</div>';
	                    $('#gastos-list').append(html);

	                });
					$('.validacion').on('click',editExpense);
					// $('.ceco').on('keyup', changeCeco);
  	  // 				$('.orden').on('keyup', changeOrden);
  	  				// $('#btn-buscar-ceco').on('click', searchCeco)
   		 			// $('#btn-buscar-orden').on('click', searchOrden)
					response.records.pais === 'CR' ? $('.GT').hide() : $('.GT').show();
				}
    		} else {
    			toastr['error'](response.message, 'Error');
    		}
    	})
    	.always(function () { $('#loader').fadeOut(); });
    }

    function aprobLiquidation (e)
    {	
    	e.preventDefault();
    	array = new Array();
    	contador = 0;
    	no_aprobados=0;
    	$.each($('#gastos-list > div.detail-expense').find('input.check-expense'), function (index, value) {
    		++contador;
    		if ($(this).is(':checked')) {
    			++no_aprobados;
    			item = new Object();
    			item.id = $(this).data('id');
    			array.push(item);
    		}
    	});
    	// if (no_aprobados<contador) {
    	// 	console.log("ingrese un comentario para los que no fueron aprobados")
    	// } else {
    	// 	console.log("todos han sido aprobados");
    	// }
    	item_liquidacion = liquidaciones[array_index];
    	// console.log(item_liquidacion);
    	data = {
    		id_liquidacion: liquidacion_id,
    		tipo: 1,
    		comentario_rechazo: '',
    		json: JSON.stringify(array),
    		empid: item_liquidacion.empid,
    		pais: item_liquidacion.pais,
    		acreedor: item_liquidacion.acreedor,
    		sociedad: item_liquidacion.sociedad,
    		uid_aprobador: uid_usuario,
    	};
    	if (array.length > 0) {
    		if (array.length < contador) {
	    		$('#modal-ver').modal('hide');
		    	$('#modal-aprobar').modal('show');
		    	$('#coments').val('');
	    	} else if (contador >= array.length) {
	    		var bolean = false;
	    		for (var i = 0; i < gastos_origen.length; i++) {
	    				//console.log(gastos_origen);
	    				// console.log(gastos_origen[i].monto);
	    			if(gastos_origen[i].monton<gastos_origen[i].monto){
	    				//console.log("entro");
	    				bolean = true;
	    				break;
	    			}

	    		}
	    		if(bolean){
	    			$('#modal-ver').modal('hide');
		    		$('#modal-aprobar').modal('show');
		    		$('#coments').val('');
	    		} else{
		    		$('#loader').show();
		    		$.ajax({
		    			type: 		'POST',
		    			url: 		'ws/travel/liquidacion/pendientes',
		    			dataType: 	'json',
		    			data: 		data
		    		})
		    		.done(function (response) {
		    			if (response.result) {
		    				$('#modal-ver').modal('hide'); 
		                    toastr['success'](response.message, 'Éxito') 
		                    setTimeout( function(){ amigable(); }, 500);
		    			} else {
		    				toastr['error'](response.message, 'Error') 
		    			}
		    		})
		    		.always(function () {
		    			$('#loader').fadeOut();
		    		});
		    	}
	    	}
    	} else {
    		$('#loader').fadeOut();
    		toastr['warning']('No ha seleccionado ningún gasto para aprobación', 'Espere');
    	}
    }

    function sendAprobLiquidation (e) 
   	{
   		e.preventDefault();
    	item_liquidacion = liquidaciones[array_index];
    	data = {
    		id_liquidacion: liquidacion_id,
    		tipo: 1,
    		comentario_rechazado: $('#coments').val(),
    		json: JSON.stringify(array),
    		empid: item_liquidacion.empid,
    		pais: item_liquidacion.pais,
    		acreedor: item_liquidacion.acreedor,
    		sociedad: item_liquidacion.sociedad
    	};
    	$('#loader').show();
		$.ajax({
			type: 		'POST',
			url: 		'ws/travel/liquidacion/pendientes',
			dataType: 	'json',
			data: 		data
		})
		.done(function (response) {
			if (response.result) {
				$('#modal-ver').modal('hide'); 
                toastr['success'](response.message, 'Éxito') 
                setTimeout( function(){ amigable(); }, 500);
			} else {
				toastr['error'](response.message, 'Error') 
			}
		})
		.always(function () {
			$('#loader').fadeOut();
		});
   	} 

    function rejectLiquidation (e)
    {	
    	e.preventDefault();
    	$('#modal-ver').modal('hide');
    	$('#modal-rechazar').modal('show');
    	$('#coment').val('')
    	console.log('hola');
    }

    function sendRejectLiquidation ()
    {
    	if ($('#coment').val()=='') {
    		toastr['error']('Ingrese un comentario de rechazo para la liquidación', 'Error')
    	} else {	
	    	$('#loader').show();
	    	array = new Array();
	    	item_liquidacion = liquidaciones[array_index];
	    	data = {
	    		id_liquidacion: liquidacion_id,
	    		tipo: 2,
	    		comentario_rechazado: $('#coment').val(),
	    		json: JSON.stringify(array),
	    		empid: item_liquidacion.empid,
	    		pais: item_liquidacion.pais,
	    		acreedor: item_liquidacion.acreedor,
	    		sociedad: item_liquidacion.sociedad
	    	};
	    	$.ajax({
				type: 		'POST',
				url: 		'ws/travel/liquidacion/pendientes',
				dataType: 	'json',
				data: 		data
			})
			.done(function (response) {
				if (response.result) {
					$('#modal-ver').modal('hide');
					$('#modal-rechazar').modal('hide');
	                toastr['success'](response.message, 'Éxito'); 
	                setTimeout( function(){ amigable(); }, 500);
				} else {
					toastr['error'](response.message, 'Error') 
				}
			})
			.always(function () {
				$('#loader').fadeOut();
			});
		}
    }

	function formato_fecha(fecha)
	{
		var A = new Date(Date.parse(fecha)).getFullYear();
	    var M = new Date(Date.parse(fecha)).getMonth()+1;
	    var D = new Date(Date.parse(fecha)).getDate()+1;
	    if (M < 10)
	        M = '0' + M;
	    if (D < 10)
	        D = '0' + D;
	    var fecha = D+'-'+M+'-'+A;
	    return fecha;
	}
	function formato_fecha2(fecha)
	{
		var A = new Date(Date.parse(fecha)).getFullYear();
	    var M = new Date(Date.parse(fecha)).getMonth()+1;
	    var D = new Date(Date.parse(fecha)).getDate()+1;
	    if (M < 10)
	        M = '0' + M;
	    if (D < 10)
	        D = '0' + D;
	    var fecha = A+'-'+M+'-'+D;
	    return fecha;
	}

	function separador_miles_decimales(id)
	{
	    var valor=id.toString();
	    var valor=valor.replace(/,/gi, " ");
	    Cantidad=generador.call(valor.split(' ').join(''),' ','.');
	}

	function generador(comma, period) 
	{
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

	jQuery('#gastos').on('click', '.guardar', function(){//----------------------------------------------------->guarda la información de los gastos
	    jQuery('#loader').show();
		var id = jQuery(this).data('id');
		jQuery('#monton_'+id).val();
		jQuery('#orden_'+id).val();
		// console.log( { ceco: jQuery('#ceco_'+id).val(), sociedad: jQuery('#sociedad_usuario_creo').val(), orden: jQuery('#orden_'+id).val() } );

			jQuery.ajax({
				url:'ws/ordenceco/sociedad',	
				type:'POST', 	
				dataType: 'json',
				data : { ceco: jQuery('#ceco_'+id).val(), sociedad: jQuery('#sociedad_usuario_creo').val(), orden: jQuery('#orden_'+id).val() },
			}).done(function( data ){
				if(data.result){
		            jQuery.ajax({
						url:'ws/travel/gastos/modificar',	
						type:'POST', 	
						dataType: 'json',
						data : {id_gasto: id, ceco: jQuery('#ceco_'+id).val(), monton: jQuery('#monton_'+id).val(),  orden: jQuery('#orden_'+id).val() },
					}).done(function( data ){
						if(data.result){
							jQuery('#cecob_'+id).val(jQuery('#ceco_'+id).val());
							jQuery('#ordenb_'+id).val(jQuery('#orden_'+id).val());
							jQuery('#montonb_'+id).val(jQuery('#monton_'+id).val());
							jQuery('#guardar_'+id).hide();

				            toastr['success']('Se guardaron los cambios en el gasto #TG-'+id, 'Éxito');
				            jQuery('#loader').fadeOut();
				        }else{
				            toastr['error'](data.message, 'Error');
				            jQuery('#loader').fadeOut();
				        }
					}).fail(function(error){
						//console.log(error);
						toastr['error'](error.message, 'Error');
				        jQuery('#loader').fadeOut();
					});
		        }else{
		            toastr['error'](data.records.ZMENSAJE, 'Error');
		            jQuery('#loader').fadeOut();
		        }
			}).fail(function(error){
				//console.log(error);
				toastr['error']('Ocurrio un error en la conexión', 'Error');
		        jQuery('#loader').fadeOut();
			});
	})

	jQuery('#gastos').on('click', '.checkbox', function(){//---------------------------------------------------->agrega o quita los id de los gastos en el json
		var id = jQuery(this).data('id');
		var index = jQuery(this).data('index');
		var nombre_clase=jQuery(this).attr('class');
		if (nombre_clase=='checkbox checked') {
			jQuery(this).removeClass('checked');
			json.pop();
		} 
		else {
			jQuery(this).addClass('checked');
			json.push({'id': id});
		}
	});

	jQuery('#gastos').on('keyup', '.cambiar', function(){//----------------------------------------------------->esconder o aparecer el boton de guardar
		var id = jQuery(this).data('id');
		var tipo = jQuery(this).data('tipo');

		if(( jQuery('#ceco_'+id).val() != jQuery('#cecob_'+id).val() ) || ( jQuery('#monton_'+id).val() != jQuery('#montonb_'+id).val() ) || ( jQuery('#orden_'+id).val() != jQuery('#ordenb_'+id).val() ))
			jQuery('#guardar_'+id).show();
		else
			jQuery('#guardar_'+id).hide();
	});

	jQuery('#btn-aprobars').on('click', function(e){//---------------------------------------------------------->rechazar liquidación
		e.preventDefault();
		// console.log();
		if( jQuery('.guardar').is(":visible") ){
			toastr['error']('Aun hay cambios que no se han guardado', 'Error');
		}else{
			var inn = 0;
			var cnta = json.length;
			contador = jQuery('.gas-todos > .panel-heading > .checked').length;
			if (contador == 0 ){
				toastr['warning']('No hay líneas seleccionadas para aprobar', 'Cuidado');
			}else{
				var inn=0;
				jQuery.each(json, function (index, item) {
					if(item)
						inn=inn+1;

					if( (cnta-1) == index ){
						if(inn == todos_gastos){
							jQuery('#loader').show();
							jQuery('#tipo').val('1');
							if( json )
								var jsons = JSON.stringify(json);
							else
								var jsons = JSON.stringify([]);

							// console.log('id_liquidacion'+jQuery('#id_liquidacion').val()+' tipo'+jQuery('#tipo').val()+' comentario_rechazado'+jQuery('#coments').val()+'json'+jsons+' pais'+jQuery('#pais_codigo').val+' sociedad'+jQuery('#sociedad_usuario_creo').val()+' empid'+jQuery('#empid').val+' codigo'+jQuery('#codigo').val()+' acreedor'+jQuery('#acreedor_us_cr').val());
							jQuery.ajax({
								url:'ws/travel/liquidacion/pendientes',	
								type:'POST', 	
								dataType: 'json',
								data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipo').val(), comentario_rechazado: jQuery('#coments').val(), json: jsons,pais: jQuery('#pais_codigo').val(),sociedad: jQuery('#sociedad_usuario_creo').val()/*jQuery('#sociedad').val()*/,empid: jQuery('#empid').val(),codigo: jQuery('#codigo').val(), acreedor:jQuery('#acreedor_us_cr').val()}
							}).done(function( data ){
								if(data.result){
									BD_Cargar();
						            toastr['success'](data.message, 'Éxito');
						            jQuery('#loader').fadeOut();
									jQuery('#modal-ver').modal('hide');
						        }else{
						            toastr['error'](data.message, 'Error');
						            jQuery('#loader').fadeOut();
						        }
							}).fail(function(error){
								//console.log(error);
								toastr['error'](error.message, 'Error');
						        jQuery('#loader').fadeOut();
							});
								// data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipo').val(), comentario_rechazado: '', json: jsons, pais: jQuery('#pais_codigo').val(),sociedad: jQuery('#sociedad_usuario_creo').val(),empid: jQuery('#empid').val(),codigo: jQuery('#codigo').val(), acreedor:jQuery('#acreedor_us_cr').val()}

						}else{
							jQuery('#loader').fadeOut();
							//console.log('no se seleccionaron todos');
							jQuery('#tipo').val('2');
							jQuery('#modal-aprobar').modal('show');
							jQuery('#modal-ver').modal('hide');
						}
					}
				});
			}
		}
	});

	jQuery('#btn-aprobar-').on('click', function(e){//----------------------------------------------------------->aprobar liquidacion
		e.preventDefault();
		// console.log('id_liquidacion'+jQuery('#id_liquidacion').val()+' tipo'+jQuery('#tipo').val()+' comentario_rechazado'+jQuery('#coments').val()+'json'+jsons+' pais'+jQuery('#pais_codigo').val+' sociedad'+jQuery('#sociedad_usuario_creo').val()+' empid'+jQuery('#empid').val+' codigo'+jQuery('#codigo').val()+' acreedor'+jQuery('#acreedor_us_cr').val());

		if( jQuery('#coments').val() ){
			jQuery('#loader').show();
			if( jQuery('.guardars').is(":visible") ){
				toastr['error']('Aun hay cambios que no se han guardado', 'Error');
			}else{
				jQuery('#tipo').val('1');
				if( json )
					var jsons = JSON.stringify(json);
				else
					var jsons = [{}];

				jQuery.ajax({
					url:'ws/travel/liquidacion/pendientes',	
					type:'POST', 	
					dataType: 'json',
					data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipo').val(), comentario_rechazado: jQuery('#coments').val(), json: jsons,pais: jQuery('#pais_codigo').val,sociedad: jQuery('#sociedad_usuario_creo').val()/*jQuery('#sociedad').val()*/,empid: jQuery('#empid').val(),codigo: jQuery('#codigo').val(), acreedor:jQuery('#acreedor_us_cr').val()}
				}).done(function( data ){
					if(data.result){
						BD_Cargar();
			            toastr['success'](data.message, 'Éxito');
			            jQuery('#loader').fadeOut();
						jQuery('#modal-aprobar').modal('hide');
			        }else{
			            toastr['error'](data.message, 'Error');
			            jQuery('#loader').fadeOut();
			        }
				}).fail(function(error){
					//console.log(error);
					toastr['error'](error.message, 'Error');
			        jQuery('#loader').fadeOut();
				});
			}
		}else{
			toastr['error']('Sin comentarios', 'Error');
		}
	});

	jQuery('#btn-rechazar-').on('click', function(e){//---------------------------------------------------------->rechazar liquidación
		e.preventDefault();

		if( jQuery('.guardars').is(":visible") ){
			toastr['error']('Aun hay cambios que no se han guardado', 'Error');
		}else{
			// if( json.length>0 ){
				jQuery('#tipo').val('2');
				jQuery('#modal-rechazar').modal('show');
				jQuery('#modal-ver').modal('hide');
			// }else{
				// toastr['warning']('No ha seleccionado los gastos para eliminar', 'Cuidado');
			// }
		}
	});

	jQuery('#btn-rechazar-enviar').on('click', function(e){//--------------------------------------------------->enviar el rechazo 
		e.preventDefault();
		var jsons = JSON.stringify([]);
		jQuery('#loader').show();
		if( jQuery('#coment').val() ){
			// console.log(		jQuery('#empid').val()	);
			jQuery.ajax({
				url:'ws/travel/liquidacion/pendientes',	
				type:'POST', 	
				dataType: 'json',
				data : {id_liquidacion: jQuery('#id_liquidacion').val(), tipo: jQuery('#tipo').val(), comentario_rechazado: jQuery('#coment').val(), json: jsons,pais: jQuery('#pais_codigo').val(),sociedad: jQuery('#sociedad_usuario_creo').val(),empid: jQuery('#empid').val(),codigo: jQuery('#codigo').val(), hola:jQuery('#codigo').val('holass'), acreedor:jQuery('#acreedor_us_cr').val()}
			}).done(function( data ){
				if(data.result){
					BD_Cargar();
		            toastr['success'](data.message, 'Éxito');
		            jQuery('#loader').fadeOut();
					jQuery('#modal-rechazar').modal('hide');
		        }else{
		            toastr['error'](data.message, 'Error');
		            jQuery('#loader').fadeOut();
		        }
			}).fail(function(error){
				//console.log(error);
				toastr['error'](error.message, 'Error');
		        jQuery('#loader').fadeOut();
			});
		}else{
			toastr['warning']('Hace falta el comentario de rechazo', 'Cuidado');
		}
	});
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------->BOTONES
	jQuery('#tabla-registros').on('click','a.btn-liq-detai',function(e){
		e.preventDefault();
		json = [];
		jQuery('#coment').val('');
		jQuery('#coments').val('');
		jQuery('#loader').show();
		var id = jQuery(this).data('id');
		jQuery('.limpiar').val('');
		jQuery('.limpiar').text('');
		todos_gastos=0;
		var soc_usu_ccreo =  jQuery(this).data('usuario');
		// console.log(soc_usu_ccreo);
		jQuery.ajax({
	        type:       'POST',
	        url:        'ws/vsociedadusuario',
	        dataType:   'json',
	        data: 		{user: soc_usu_ccreo},
	    })
	    .done(function(data){
	        if( data.result )
	        {
	        	jQuery('#pais_codigo').val(data.records.PAIS);
	        	pais=data.records.PAIS;
	        	//console.log(pais);
	        	jQuery('#sociedad_usuario_creo').val(data.records.SOCIEDAD);
	        	jQuery('#acreedor_us_cr').val(data.records.ACREEDOR);
	        	jQuery('#empid').val(data.records.EMPID);
	        	if( jQuery('#pais_codigo').val()=='GT' ){
                jQuery('#pais_nombre').val('Guatemala');
            }
            if( jQuery('#pais_codigo').val()=='CR' ){
                jQuery('#pais_nombre').val('Costa Rica');
            }
            segunda();
	        }
	        else
	            toastr['error'](data.message, 'Error');
	    }).fail(function(err){
	        //console.log('Pais no se detectó');
	    });
	    function segunda(){


		jQuery.ajax({
			url:'ws/travel/liquidacion/detalles',	
			type:'POST', 	
			dataType: 'json',
			data : {id_liquidacion: id},
		}).done(function( data ){
			//console.log(data.records);
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

			// jQuery('#sociedad').val()= consulta.usuario_creo;
			jQuery('#fecha_finalizacion').text(formato_fecha(consulta.fecha_finalizacion));
			jQuery('#fecha_liquidacion').text(formato_fecha(consulta.fecha_liquidacion));
			jQuery('#tipos').text(consulta.tipo);
			jQuery('#monton').text(consulta.monto);
			jQuery('#justificacion').text(consulta.justificacion);
			jQuery('#comentario_rechazado').text(consulta.comentario_rechazado);
			jQuery('#coment').val('');
			// Gastos
			jQuery('.gas-todos').remove();
			switch( pais ){
	            case 'CR':
	                doc = 'Número de Cédula';
	                var ver = 'none';
	            break;
	            case 'GT':
	                doc = 'NIT';
	                var ver = 'block';
	            break;
	        }
	        if(consulta.gastos.length>0){
	        	var conteo = consulta.gastos.length-1;
	        	jQuery.each(consulta.gastos, function (index, valor) { 
	        		var cecos='';
	        		if( !valor.ceco )
	        			cecos=' disabled="true" '
	        		if( valor.estado == 2 )
	        			var est='<span style="font-size: 0.5em;" class="label label-danger">Reenviada</span>';
	        		else
	        			if( valor.estado == 1 )
	        				var est='<span style="font-size: 0.5em;" class="label label-success">Aprobada</span>';
	        			else
	        				var est='';

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
				    			valor.cnta_gasto=valor_gasto.cuenta.nombre;
				    			encuentro=1;
				    		}
				    		if(contar == index_GASTO && encuentro==0)
				    			valor.cnta_gasto='Sin Asignar';

				    		if(contar == index_GASTO){
				    			todos_gastos=todos_gastos+1;
				    			if(valor.ceco){
				    				cecoatr='<input minlength="10" maxlength="10" type="text" name="ceco_" id="ceco_'+valor.id+'"  '+cecos+'  class="form-control cambiar  limpiar"  data-id="'+valor.id+'" data-tipo="ceco" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>';
				    				ordenatr='<span type="text" class="form-control limpiar" id="orden_'+valor.id+'" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.orden+'</span>';
				    			}else{
				    				cecoatr='<span type="text" class="form-control limpiar" id="ceco_'+valor.id+'" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.ceco+'</span>';
				    				ordenatr='<input minlength="12" maxlength="12" type="text" name="ceco_" id="orden_'+valor.id+'" class="form-control cambiar  limpiar"  data-id="'+valor.id+'" data-tipo="orden" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.orden+'"/>';
				    			}
				    			if (pais=='CR') {
				    				doc="Numero de cedula"
				    			} else if(pais=='GT') {
				    				doc= "Nit"
				    			}
				    			//console.log(pais);
				    			jQuery('#gastos-list').append(''+
									'<div class="panel panel-info gas-todos">'+
										'<div class="panel-heading" style="font-size: 1.6em;">'+
											'<input id="'+index+'" type="checkbox" />'+
									  			'<label for="'+index+'" class="checkbox" data-index="'+index+'" data-id="'+valor.id+'">Gasto #'+valor.correlativo+'      '+
									  		'</label>'+
										'</div>'+
										'<div class="panel-body">'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> CECO #</span>'+cecoatr+
											  		// '<input type="text" name="ceco_" id="ceco_'+valor.id+'"  '+cecos+'  class="form-control cambiar  limpiar"  data-id="'+valor.id+'" data-tipo="ceco" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
											  		'<input style="display: none;" type="hide" name="ceco_" id="cecob_'+valor.id+'" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Monto '+jQuery('#moneda').text()+'</span>'+
											  		'<input type="text" name="monton_" id="monton_'+valor.id+'" class="form-control cambiar limpiar"  data-id="'+valor.id+'" data-tipo="monton" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
											  		'<input style="display: none;" type="hide" name="monton_" id="montonb_'+valor.id+'" class="form-control" placeholder="Cantidad" aria-describedby="basic-addon1" value="'+valor.monton+'"/>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info">'+doc+'</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Cantidad" aria-describedby="basic-addon1" >'+valor.documento+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Cód. Tributario</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1">'+valor.codigo_tributario+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Órden</span>'+
													ordenatr+
											  		'<input style="display: none;" type="hide" name="ceco_" id="ordenb_'+valor.id+'" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.orden+'"/>'+
											  		// '<input type="text" name="ceco_" id="orden_'+valor.id+'" '+ordenatr+'  class="form-control cambiar  limpiar"  data-id="'+valor.orden+'" data-tipo="ceco" placeholder="Sin Asignar" aria-describedby="basic-addon1" value="'+valor.ceco+'"/>'+
											  		// '<span type="text" class="form-control limpiar" id="orden_'+valor.id+'" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.orden+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Cnta. gasto</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.cnta_gasto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Factura #</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.factura+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Fecha</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+formato_fecha(valor.fecha)+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="col-lg-6">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Impuesto</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.impuesto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> ISR </span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.isr+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" style="display: '+ver+';"></div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Retención #</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_numero+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="col-lg-6" style="display: '+ver+';">'+
												'<div class="input-group">'+
													'<span class="input-group-addon btn-info"> Retención '+jQuery('#moneda').text()+'</span>'+
											  		'<span type="text" class="form-control limpiar" placeholder="Sin Asignar" aria-describedby="basic-addon1" >'+valor.retencion_monto+'</span>'+
												'</div>'+
											'</div>'+
											'<div class="form-group col-md-12" ></div>'+
											'<div class="form-group col-md-12" >'+
												'<a class="thumbnail" href="'+valor.foto+'" target="_blank"><img src="'+valor.foto+'" alt="Little Egret" width="60%" height="60%" border="0"></a>'+
											'</div>'+
											'<div class="form-group col-md-12 guardars" style="display: none;" id="guardar_'+valor.id+'">'+
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
				       // console.log('Pais no se detectó');
				    });
				});
	        }
	        else{
	        	jQuery('#gastos').append(''+
	        		'<div style="font-size: 1.2em;"" class="alert alert-info gas-todos" role="alert"><center>No hay Gastos para esta liquidacion</center></div>'+
	        	'');
	        	jQuery('#loader').hide();
	        }
		})
		.fail(function(error){console.log('error: ');console.log(error);})
		}
	});
});
