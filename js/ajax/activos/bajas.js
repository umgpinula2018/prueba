jQuery(document).ready(function($){

    var id_registro = 0;
    var sim=0;
    var sim_op=0;
    var id_registro_eliminar = 0;
    window.tabla_registros = $("#tabla-registros").DataTable(
    {
         "language": {
            "url": 'lang/esp.lang'
        },
        deferRender: true,
        processing: true,
        serverSide: true,
        ajax: 'ws/activos/equipos/solicitados',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index',},
            {data: 'tipo', name: 'tipo'},
            {data: 'marca', name: 'marca'},
            {data: 'modelo', name: 'modelo'},
            {data: 'serial', name: 'serial'},
            {data: 'codigo_nombre', name: 'codigo_nombre'},
            {data: 'contrato', name: 'conrato'},
            {data: 'fecha_vencimiento', name: 'fecha_vencimiento'},
            {data: 'precio_costo', name: 'precio_costo'},
            {data: 'fecha_entrega', name: 'fecha_entrega'},
            {data: 'uid_empleado', name: 'uid_empleado'},
            {data: 'empid', name: 'empid'},
            {data: 'sim_nombre', name: 'sim_nombre'},
            {data: 'telefono_nombre', name: 'telefono_nombre'},
            {data: 'compania_nombre', name: 'compania_nombre'},
            {data: 'plan_nombre', name: 'plan_nombre'},
            {data: 'maletin_nombre', name: 'maletin_nombre'},
            {data: 'estado_equipo', name: 'estado_equipo'},
            {data: 'acciones', name: 'acciones'},
        ],
        order:[[ 1, "ASC" ]]
    });
    $('#loader').fadeOut();
    
    window.tabla_registros7 = $("#tabla-registros7").DataTable(
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
    function llenarTabla(){
        // console.log("lenando tabla");
        // window.tabla_registros.clear().draw();
        // $('#loader').show();
        // $.ajax({
        //     url:        'ws/activos/equipos/solicitados',
        //     type:       'GET',
        //     dataType:   'json'
        // })
        // .done(function(response){
        //     if (response.result) {
        //         console.log(response.records);
        //         cont = 0; acciones = '';
        //         $.each(response.records, function(index, value) {
        //             if (value.estado!=3) {
        //                 acciones =  '<td>'+
        //                                 '<a class="btn btn-danger btn-xs btn-darBaja" title="Dar baja" href="#modal-inactivo" data-toggle="modal"  data-idregistro="'+value.id+'"><i class="fa fa-caret-square-o-down"></i></a>'+
        //                             '</td>';
        //                 col1  = ++cont;
        //                 col2  = value.tipo['nombre'];
        //                 col3  = value.marca['nombre'];
        //                 col4  = value.modelo;
        //                 col5  = value.serial;
        //                 col6  = value.codigo;
        //                 col7  = value.contrato['descripcion'];
        //                 col8  = value.fecha_vencimiento;
        //                 col9 = "Solicitado";
        //                 col10 = value.fecha_entrega;
        //                 col11 = value.uid_empleado;
        //                 col12 = value.empid;
        //                 if (value.id_tipo==12) {
        //                     col13 = value.sim
        //                     col14 = value.no_telefono;
        //                     col15 = value.compania['nombre'];
        //                     col16 = value.plan['nombre'];
        //                 } else {
        //                     col13 = "Sin sim";
        //                     col14 = "Sin telefono";
        //                     col15 = "Sin Compañia";
        //                     col16 = "Sin Plan";
        //                 }
        //                 col17 = value.maletin == 1 ? "Si" : "No"; //nuevo bart
        //                 col18 = value.estadoequipo['estado']; //nuevo bart
        //                 col19 = acciones;
        //                 window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17,col18,col19]).draw(false);
        //              } else {
                        
        //             }
        //         });
        //     } else {
        //         toastr['error'](response.message, 'Error');
        //     }
        // })
        // .fail(function(response){
        //     toastr['error'](response.message, 'Error');
        // })
        // .always(function(){ $('#loader').fadeOut(); })
    }

    function buscarEquipos(){
        var cont=0;
        window.tabla_registros7.clear().draw();

        const uid_empleado = $("#uid_empleado3").val().trim();

        var pattern_email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        if ( uid_empleado.length == 0 || pattern_email.test(uid_empleado)) {
            
            $.ajax({
                url:        'ws/activos/buscar/equipos',
                type:       'GET',
                dataType:   'json',
                data:       $('#form-baja').serialize()
                })
                .done(function(response){

                    if (response.result) {

                        $.each(response.records, function(index, value) {
                            if (value.estado!="3") {
                                col1  = ++cont;
                                
                                if (value.tipo) {
                                    col2  = value.tipo['nombre'];
                                } else {
                                    col2  = "Sin tipo";
                                }
                                if (value.marca) {
                                     col3  = value.marca['nombre'];
                                } else {
                                     col3  = "Sin marca";
                                }

                                col4  = value.modelo;
                                col5  = value.serial;
                                col6  = value.codigo;
                                if (value.contrato) {
                                    col7  = value.contrato['descripcion'];
                                } else {
                                    col7  = "Sin descripción";
                                }
                                col8  = value.fecha_vencimiento;
                                col9  = value.fecha_entrega;
                                col10 = value.uid_empleado;
                                col11 = value.empid;
                                if (value.id_tipo==1) {
                                    col12 = value.sim
                                    col13 = value.no_telefono;
                                    if (value.compania) {
                                        col14 = value.compania['nombre'];
                                    } else {
                                        col14 = "Sin compañía";
                                    }
                                    if (value.plan) {
                                        col15 = value.plan['nombre'];
                                    } else {
                                        col15 = "Sin plan";
                                    }
                                } else {
                                    col12 = "Sin sim";
                                    col13 = "Sin telefono";
                                    col14 = "Sin Compañia";
                                    col15 = "Sin Plan";
                                }
                                col16 = value.maletin == 1 ? "Si" : "No"; //nuevo bart
                                
                                if (value.estadoequipo) {
                                    col17 = value.estadoequipo['estado']; //nuevo bart
                                } else {
                                    col17 = "Sin estado"; //nuevo bart
                                }
                                window.tabla_registros7.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17]).draw(false);
                            }
                        });
                        
                        if (cont<1){
                            toastr['error']('El usuario no cuenta con equipos asignados', 'Error');  
                        }

                    }

                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); });

        }
        else {
            toastr.error('El UID ingresado no es válido o no existe');
        }
        
    }

    $('#btn-dar-baja').on('click', darBaja);
    $('#btn-baja').on('click', limpiarbaja);
    function limpiarbaja(){
        window.tabla_registros7.clear().draw();
        $('#uid_empleado3').val('');
    }
    $('#tabla-registros').on('click', 'a.btn-darBaja', function(){
        id_registro = $(this).data('idregistro');
    });
    $('.close').on('click',function(){
        // console.log('entro a reload');
        // window.location.reload();
    });
     $('#btn-cancelar').on('click',function(){
        console.log('entro a reload');
        window.location.reload();
    });
    $('#btn-buscar').on('click', buscarEquipos);

    
    $('#btn-baja-final').on('click', darBajaUsuario);
    function darBajaUsuario(){
        $usuario=$('#uid_empleado3').val();
    	$.ajax({
            url:        'ws/vacaciones/diasdisponibles',
            type:       'GET',
            dataType:   'json',
            data: 		{user:$usuario}
        })
        .done(function(response){
            if (response.result) {
            	$jefe = response.records.USUARIOS.item[0].UNAME;
      			$jefe = $jefe.concat("@FIFCO.COM");
                $usuario_log = $('#usuario_log').val();
                $.ajax({
                    url:        'ws/activos/asignar/jefe',
                    type:       'GET',
                    dataType:   'json',
                    data:       {uid_empleado:$usuario,jefe:$jefe,usuario_log:$usuario_log}
                })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'El usuario ha sido dado de baja')  
                         $("#modal-baja").modal('hide'); 
                         window.tabla_registros7.clear().draw();
                         window.location.reload();
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function(response){
                    console.log('fail');
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); })



            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            console.log('fail');
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }

    function darBaja(){
        $.ajax({
            url:        'ws/activos/baja/equipo/'+id_registro,
            type:       'POST',
            dataType:   'json',
            data:       $('#form-baja-equipo').serialize()
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $("#modal-inactivo").modal('hide'); 
                window.location.reload();
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            console.log('fail');
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }
});