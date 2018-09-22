jQuery.noConflict();
jQuery(document).ready(($)=>{

	/*
	var min = new Date(2017, 8, 1),
		max = new Date(2018, 1, 14),
		formData;

	for(var i = 0 ; i < 25 ; i++) {

		formData = new FormData();
        formData.append("id_general", 20);
        formData.append("id_especifica", chance.pickone([18, 19, 20]));
        formData.append("imagen", undefined );
        formData.append("video", undefined);
        formData.append("documento", undefined);
        formData.append("email", undefined);
        formData.append("audio", undefined);
        formData.append("fecha", moment(chance.date({min, max})).format('YYYY[-]MM[-]DD'));
        formData.append("detalle", "[{\"type\":\"number\",\"label\":\"Número\",\"className\":\"form-control\",\"name\":\"number-1518029949992\",\"value\":\"434\"}]");
        formData.append("uid_solicitante", chance.pickone(['MALVARA22424@FIFCO.COM', 'RUMANA21310@FIFCO.COM', 'JMOREIR7976@FIFCO.COM']));
        formData.append("uid_empleado", chance.pickone(['LROJAS21281@FIFCO.COM', 'LQUIEL17432@FIFCO.COM', 'LMYRIE11313@FIFCO.COM', 'LMUNGUI10959@FIFCO.COM', 'LMORERA20750@FIFCO.COM', 'LMORALE7027@FIFCO.COM']));
		
		(function (_formData) {

			$.ajax({
				url: 'ws/medidas/solicitudes',
                data: _formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                	console.log(data);
                },
                error: function(data) {
                    console.log(data);
                }
			});
		})(formData);
	}*/

	if(!jQuery.fn.datepicker) {
		$.when(
			$.getScript('js/bootstrap-datepicker.js'),
			$.Deferred( (deferred) => {
				$(deferred.resolve);
			})
		).done(()=>{
			jQuery('.input-date-picker').datepicker({
		        format: 'yyyy-mm-dd',
		        orientation: "bottom",
		        daysOfWeekDisabled: "7",
		        calendarWeeks: true,
		        autoclose: true,
		        todayHighlight: true,
		        endDate: 'today'
		    });
		});
	}
	else {
		$('.input-date-picker').datepicker({
	        format: 'yyyy-mm-dd',
	        orientation: "bottom",
	        daysOfWeekDisabled: "7",
	        calendarWeeks: true,
	        autoclose: true,
	        todayHighlight: true,
	        endDate: 'today'
	    });
	}

	$("#table_tickets").on('click', '.btn-detail', detalleFalta);
	$("#exportar_general").on('click', (e) => {
		e.preventDefault();

		const fecha_inicio_general 	= $("#fecha_inicio_general").val(),
			  fecha_fin_general 	= $("#fecha_fin_general").val();

		if(fecha_inicio_general.length > 0 && fecha_fin_general.length > 0) {
			if(fecha_fin_general > fecha_inicio_general || fecha_fin_general == fecha_inicio_general ) {
				window.location.href = 'ws/medidas/tiempos_solucion/exportar?fecha_inicio='+ fecha_inicio_general +'&fecha_fin=' + fecha_fin_general;
			}
			else {
				toastr.warning('Las fechas son invalidas revise por favor');
			}
		}
		else {
			toastr.warning('Las fechas estan vacias');
		}
	});

	
	$("#loader").show();
	
	var xhr = $.getJSON('ws/medidas/reportes/tiempos');
	
	xhr
	.done((response) => {
		
		if (response.result) {

			var {records} = response,
				html = [],
				diff,
				diff_traslado_legal;

			records.forEach( (falta, index) => {
				console.log(falta);
				if ( falta.estado == 1 ) {

					/**
					 * [diff (difference) Días que se demoró en aprobar la fecha (diferencia entre la fecha de aprobación y la fecha de creación)]
					 * @type {[type]}
					 */
					
					diff = Math.abs(moment(falta.fecha_aprobacion).diff(falta.created_at, 'days', true));
					
					if (diff == 0)
						diff = 1;
					console.log(falta.falta_amonestacion.amonestacion);
					json = {
						aprobo: {NOMBRE: falta.aprobo.NOMBRE},
						fecha_aprobacion: falta.fecha_aprobacion,
						especifica: {descripcion: falta.especifica.descripcion},
						falta_amonestacion: {
							descripcion: falta.falta_amonestacion.descripcion,
							amonestacion: {
								descripcion: falta.falta_amonestacion.amonestacion.descripcion
							}
						},
						general: {descripcion: falta.general.descripcion},
						created_at: falta.created_at,
						estado: falta.estado
					};
					html.push(
						`<tr>
							<td>
								${index+1}
							</td>
							<td>
								${falta.jefe && falta.jefe.NOMBRE ? falta.jefe.NOMBRE : ''}
							</td>
							<td>
								${falta.empleado && falta.empleado.NOMBRE ? falta.empleado.NOMBRE : ''}
							</td>
							<td>
								${falta.empleado && falta.empleado.EMPID ? falta.empleado.EMPID : ''}
							</td>
							<td>
								${falta.aprobo && falta.aprobo.NOMBRE ? falta.aprobo.NOMBRE : ''}
							</td>
							<td>
								${diff > 1 ? (round(diff, 0)) + ' dias' : '1 dia'}
							</td>
							<td></td>
							<td></td>
							<td>
								<a href="#" class='btn btn-success btn-xs btn-detail' data-detail='${JSON.stringify(json)}'>DETALLES</a>
							</td>
						</tr>`
					);

					index++;

				}
				else if ( falta.estado == 4 ) {
					diff = Math.abs(moment(falta.fecha_aprobacion_legal).diff(falta.fecha_envio_legal, 'days', true));
					diff_traslado_legal = Math.abs(moment(falta.created_at).diff(falta.fecha_envio_legal, 'days', true));
					diff_traslado_legal = Math.ceil(diff_traslado_legal);
					
					if(diff == 0)
						diff = 1;

					console.log(falta);
					json = {
						aprobo: {NOMBRE: falta.aprobo.NOMBRE},
						fecha_aprobacion: falta.fecha_aprobacion,
						especifica: {descripcion: falta.especifica.descripcion},
						//falta_amonestacion: {descripcion: falta.falta_amonestacion.descripcion},
						general: {descripcion: falta.general.descripcion},
						created_at: falta.created_at,
						estado: falta.estado
					};

					html.push(
						`<tr>
							<td>
								${index+1}
							</td>
							<td>
								${falta.jefe && falta.jefe.NOMBRE ? falta.jefe.NOMBRE : ''}
							</td>
							<td>
								${falta.jefe && falta.empleado.NOMBRE ? falta.empleado.NOMBRE : ''}
							</td>
							<td>
								${falta.empleado && falta.empleado.EMPID ?falta.empleado.EMPID : ''}
							</td>
							<td>
								${falta.traslado_legal && falta.traslado_legal.NOMBRE ? falta.traslado_legal.NOMBRE : ''}
							</td>
							<td>
								${diff_traslado_legal > 1 ? diff + ' días' : diff + ' día'}
							</td>
							<td>
								${falta.aprobo && falta.aprobo.NOMBRE ? falta.aprobo.NOMBRE : ''}
							</td>
							<td>
								${diff > 1 ? (round(diff, 0)) + ' dias' : '1 dia'}
							</td>
							<td>
								<a href="#" class='btn btn-success btn-xs btn-detail' data-detail='${JSON.stringify(json)}'>DETALLES</a>
							</td>
						</tr>`
					);

					/*html.push( `<tr style='background: #dddddd;'> <td> ${index} </td> <td> ${falta.empleado.NOMBRE} </td> <td> ${falta.empleado.PUESTO} </td> <td> ${falta.uid_empleado} </td> <td> ${diff > 1 ? (round(diff, 0)) + ' dias' : '1 dia'} </td> <td> <a href="#" class='btn btn-success btn-xs btn-detail' data-detail='${JSON.stringify(falta)}'>DETALLES</a> </td> </tr>` );*/
				}
			});

			$("#table_tickets tbody").html(html.join(""));

		} else {
			toastr.error(response.message, 'Error');
		}
	})
	.fail((response)=>{
		toastr.error(response.message, 'Error');
		$("#loader").fadeOut();
	})
	.always(() => {
		$("#loader").fadeOut();
	});

	function detalleFalta(e) {
		
		e.preventDefault();
		var detail = JSON.parse($(this).attr('data-detail'));
		var body;
		try {
			if (detail.estado == 1) {
				body = `
					<tr>
						<td>
							${detail.general.descripcion}
						</td>
						<td>
							${detail.especifica.descripcion}
						</td>
						<td>
							${detail.falta_amonestacion.amonestacion.descripcion}
						</td>
						<td>
							${moment(detail.created_at).format('DD[-]MM[-]YYYY')}
						</td>
						<td>
							${detail.aprobo.NOMBRE}
						</td>
						<td>
							${moment(detail.fecha_aprobacion).format('DD[-]MM[-]YYYY')}
						</td>
					</tr>
				`;
			
				$("#table-detalle-falta tbody").html(body);
				$("#modal-faltas").modal();
			}
			else {
				body = `
					<tr>
						<td>
							${detail.general.descripcion}
						</td>
						<td>
							${detail.especifica.descripcion}
						</td>
						<td>
							${moment(detail.created_at).format('DD[-]MM[-]YYYY')}
						</td>
						<td>
							${moment(detail.fecha_envio_legal).format('DD[-]MM[-]YYYY')}
						</td>
						<td>
							${detail.aprobo.NOMBRE}
						</td>
						<td>
							${moment(detail.fecha_aprobacion_legal).format('DD[-]MM[-]YYYY')}
						</td>
					</tr>
				`;

				$("#table-detalle-legal tbody").html(body);
				$("#modal-legal").modal();

			}
		} catch(e) {
			console.log(e);
		}
	}

	function round(value, decimals) {
	    return Number(Math.round(value +'e'+ decimals) +'e-'+ decimals).toFixed(decimals);
	}

});
