jQuery(document).ready( ($) => {

	loadTable();

	$(document).on('click', '.btn-see-report', verListado);
	$(document).on('click', '.btn-reporte-excel', reporteExcel);
	$("#table-report-legal").on('click', '.btn-save', aprobarSolicitud);
	$(".btn-generar-reporte").on('click', generarReporte);
	$("#exportar_general").on('click', generarReporteGeneral);
	
	if (jQuery.fn.datepicker) {
		
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
	else {

		$.when(
			$.getScript('js/bootstrap-datepicker.js'),
			$.Deferred(function (deferred) {
                $(deferred.resolve);
			})
		).done( (datepicker) => {


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


	function verListado(e) {
		e.preventDefault();
		var reports = $(this).parent().parent().parent().data('report');
		var reports_html = [];

		reports.forEach((solicitud, index)=>{
			if(solicitud.estado == 4) { //Ya fue aprobado
				reports_html.push("<tr><td>"+ solicitud.empleado.NOMBRE +"</td><td>"+ solicitud.empleado.PUESTO +"</td><td>"+ solicitud.empleado.DEPTO +"</td><td>"+ solicitud.empleado.UID +"</td><td>"+ solicitud.general.descripcion +"</td><td>"+ solicitud.especifica.descripcion +"</td><td>"+ moment(solicitud.fecha).format("DD[-]MM[-]YYYY") +"</td><td>"+ moment(solicitud.fecha_aprobacion_legal).format('DD[-]MM[-]YYYY') +"</td><td><span class='text-success'>APROBADO</span></td></tr>");
			}
			else {
				reports_html.push("<tr><td>"+ solicitud.empleado.NOMBRE +"</td><td>"+ solicitud.empleado.PUESTO +"</td><td>"+ solicitud.empleado.DEPTO +"</td><td>"+ solicitud.empleado.UID +"</td><td>"+ solicitud.general.descripcion +"</td><td>"+ solicitud.especifica.descripcion +"</td><td>"+ moment(solicitud.fecha).format("DD[-]MM[-]YYYY") +"</td><td><span class='text-danger'>No Aprobado</span></td><td><button class='btn btn-success btn-sm btn-save' data-id='"+ solicitud.id +"'>APROBAR</button></td></tr>");
			}
		});

		$("#table-report-legal tbody").html(reports_html.join(""));
		$("#modal-report").modal();
	}

	/**
	 * [aprobarSolicitud Save legal manager request]
	 * @param  {[type]} e event jQuery
	 * @return {[type]}  nothing
	 */
	function aprobarSolicitud(e) {
		e.preventDefault();
		var parent = $(this).parent();
		var id = $(this).data('id');
		var td = $(this).parent().siblings().eq(7);	
		var hoy = moment(new Date()).format('YYYY[-]MM[-]DD');
		var usuario = localStorage.USUARIO;

		$("#loader").show();

		var xhr = $.ajax({
			url: 'ws/medidas/solicitudes/'+id,
			type: 'PUT',
			dataType: 'json',
			data: {
				estado: 4,
				fecha: hoy,
				aprobo: usuario
			}
		});

		xhr
		.done((response)=>{
			if(response.result) {
				toastr.success(response.message, 'Éxito');
				parent.empty().html("<span class='text-success'>APROBADO</span>");
				td.empty().html(moment(hoy).format('DD[-]MM[-]YYYY'));
				loadTable();
			}
			else {
				toastr.success('No se pudo actualizar la solicitud.  Intenta nuevamente');
			}
		})
		.fail((error)=>{
			toastr.error(error.message, 'Error');
		});
		
	}

	function loadTable() {
		var xhr = $.get('ws/medidas/reportes/gerente_legal');

		$("#loader").show();

		xhr
		.done( (response) => {
			$("#loader").fadeOut();
			var reports = _.groupBy(response.records, 'uid_solicitante');
			var reports_html = [];

			var index = 1;
			var data;
			var actual;
			var groupByEstado;
			var aprobadas;

			for (var uid in reports) {
				data = reports[uid];
				groupByEstado = _.groupBy(data, 'estado');
				
				aprobadas =  groupByEstado[4] == undefined ? 0 : groupByEstado[4].length;

				actual = data[0];
				console.log(actual);
				reports_html.push("<tr data-report='"+ JSON.stringify(data) +"' ><td>"+ index +"</td> <td>"+ actual.jefe.NOMBRE +"</td><td>"+ actual.uid_solicitante +"</td><td>"+ actual.jefe.PUESTO +"</td><td>"+ data.length +"</td><td>"+ aprobadas +"</td><td><div><a class='btn btn-success btn-xs btn-see-report' href=''>VER CASOS</a></div><div><a href='' style='margin-top: 5px;' class='btn btn-success btn-xs btn-reporte-excel'>REPORTE EXCEL</a></div></td></tr>");
				index++;
			}
			$("#ejecutivos_rrhh tbody").html(reports_html.join(""));
		})
		.fail((error)=>{
			$("#loader").fadeOut();
			toastr.error(error.message, 'Error');
		});
	}

	function reporteExcel(e) {
		
		e.preventDefault();
		const uid = $(this).parent().parent().siblings().eq(2).text();
		$("#fecha_inicio, #fecha_fin").val("");
		$("#reporte-excel-modal").removeAttr('data-uid').attr('data-uid' , uid).modal();
	
	}

	function generarReporte(e) {
		e.preventDefault();
		const fecha_inicio = $("#fecha_inicio").val(),
			fecha_fin = $("#fecha_fin").val(),
			uid = $("#reporte-excel-modal").attr('data-uid');

		if(fecha_inicio && fecha_fin) {
			if(fecha_fin > fecha_inicio || fecha_fin == fecha_inicio) {
				//window.location.href = 'http://localhost/fifcoone-web/public/ws/medidas/legal/ejecutivo/exportar?uid='+ uid +'&fecha_fin='+ fecha_fin +'&fecha_inicio=' + fecha_inicio;
				window.location.href = 'ws/medidas/legal/ejecutivo/exportar?uid='+ uid +'&fecha_fin='+ fecha_fin +'&fecha_inicio=' + fecha_inicio;
			}
			else {
				toastr.warning('Las fechas son invalidas revise por favor');
			}
		}
		else {
			toastr.warning('Las fechas estan vacias');
		}
	}

	function generarReporteGeneral(e) {
		e.preventDefault();
		const fecha_inicio_general 	= $("#fecha_inicio_general").val(),
			  fecha_fin_general 	= $("#fecha_fin_general").val();

		if(fecha_inicio_general.length > 0 && fecha_fin_general.length > 0) {
			if(fecha_fin_general > fecha_inicio_general || fecha_fin_general == fecha_inicio_general ) {
				window.location.href = 'ws/medidas/legal/exportar?fecha_fin='+ fecha_fin_general +'&fecha_inicio='+fecha_inicio_general;
			}
			else {
				toastr.warning('Las fechas son invalidas revise por favor');
			}
		}
		else {
			toastr.warning('Las fechas estan vacias');
		}
	}
	
});