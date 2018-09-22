jQuery(document).ready(($)=>{
	$('#loader').fadeOut();

	$("#buscar-empleado").on('click', buscarEmpleado);	
	$("#buscar-uen").on('click', buscarUEN)


	$("#exportar").on('click', function (e) {
		e.preventDefault();
		var uid = $("#uid_empleado_hidden").val();
		window.location.href = "ws/medidas/empleado/"+ uid +"/faltas/exportar";
	});

	function buscarEmpleado(e) {
		e.preventDefault();
		var uid = $("#uid_empleado").val().trim();
		
		if(uid != "") {
			var xhr = $.getJSON("ws/medidas/reportes/empleados", {
				UID: uid
			});

			xhr
			.done((response)=>{

				if(response.result) {

					var solicitudes = response.records;
					var faltas_html = [];
					
					if (solicitudes.length > 0) {
						solicitudes.forEach((solicitud, index)=>{
							faltas_html.push("<tr><td>"+ (index+1) +"</td><td>"+ moment(solicitud.created_at).format("DD[-]MM[-]YYYY") +"</td><td>"+ solicitud.empleado.PUESTO +"</td><td>"+ solicitud.especifica.descripcion +"</td> <td>"+ solicitud.general.descripcion +"</td> <td>"+ solicitud.falta_amonestacion.amonestacion.descripcion +"</td> <td>"+ moment(solicitud.fecha_aprobacion).format("DD[-]MM[-]YYYY") +"</td> </tr>")
						});
						$("#faltas_empleado tbody").html(faltas_html.join(""));
						$("#nombre_empleado").val(solicitudes[0].empleado.NOMBRE);	
						$("#puesto_empleado").val(solicitudes[0].empleado.PUESTO);
						$("#uid_empleado_hidden").val(uid);
						$("#empid_empleado, #empid_empleado_hidden").val(solicitudes[0].empleado.EMPID);
						$("#exportar").removeAttr("disabled");
					}
					else {
						toastr.info('No se encontraron faltas del empleado');
						clearInputs(['#empid_empleado', '#empid_empleado_hidden', '#nombre_empleado', '#puesto_empleado']);
						clearTable();
					}

				}
				else {
					toastr.error('Ocurrió un error.  Intenta nuevamente');
				}

			})
			.fail((error)=>{
				toastr.error(error.message, 'Error');
				console.log(arguments);
			});
		}
		else {
			toastr.warning("Debes ingresar el UID de un empleado para realizar la búsqueda");
		}
	};

	function buscarUEN(e) {
		e.preventDefault();
		var empid = $("#empid_empleado").val().trim();

		if (empid.length > 0) {
			var xhr = $.get('ws/medidas/reportes/empleados', {
				EMPID: empid
			});

			xhr
			.done((response)=>{

				if(response.result) {
					var solicitudes = response.records;
					var faltas_html = [];

					if(solicitudes.length > 0) {
						solicitudes.forEach((solicitud, index)=>{
							faltas_html.push("<tr><td>"+ (index+1) +"</td><td>"+ moment(solicitud.fecha).format("DD[-]MM[-]YYYY") +"</td><td>"+ solicitud.empleado.PUESTO +"</td><td>"+ solicitud.especifica.descripcion +"</td> <td>"+ solicitud.general.descripcion +"</td> <td>"+ solicitud.falta_amonestacion.amonestacion.descripcion +"</td> <td>"+ moment(solicitud.fecha_aprobacion).format("DD[-]MM[-]YYYY") +"</td> </tr>")
						});

						$("#faltas_empleado tbody").html(faltas_html.join(""));
						$("#nombre_empleado").val(solicitudes[0].empleado.NOMBRE);	
						$("#puesto_empleado").val(solicitudes[0].empleado.PUESTO);
						$("#uid_empleado, #uid_empleado_hidden").val(solicitudes[0].empleado.UID);
						
						$("#empid_empleado_hidden").val(empid);
						$("#exportar").removeAttr("disabled");
					}
					else {
						toastr.info('No se encontraron faltas del empleado');
						clearInputs(['#uid_empleado', '#uid_empleado_hidden', '#nombre_empleado', '#puesto_empleado']);
						clearTable();
					}

				}
				else {
					toastr.error('Ocurrió un error. Intenta nuevamente');
				}

			})
			.fail((response)=>{
				toastr.error(response.error, 'Error');
				console.log(response);
			});
		}
		else {
			toastr.warning('Debes ingresar el número de empleado para realizar la búsqueda')
		}

	}

	function clearInputs(inputs) {
		$(inputs.join(", ")).val("");
	}

	function clearTable() {
		$("#faltas_empleado tbody").html("");
	}

});