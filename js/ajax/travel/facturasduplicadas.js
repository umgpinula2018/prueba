var todo=[];
var ver='';
var doc='';
var encontro=0;
jQuery(document).ready(iniciar);
function iniciar()
{
    jQuery('#loader').show();
    var Cantidad=0;
    window.tabla_BD = jQuery('#tabla-registros').DataTable(
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
        type:       'POST',
        url:        'ws/vsociedadusuario',
        dataType:   'json',
        data:       {user: localStorage.USUARIO},
    })
    .done(function(data){
        if( data.result )
        {
            jQuery('#pais_codigo').val(data.records.PAIS);
            if( jQuery('#pais_codigo').val()=='GT' ){
                jQuery('#pais_nombre').val('Guatemala');
                jQuery('.documento').text('NIT');
                doc='NIT';
                jQuery('.gt').show();
                ver='none';
                // BD_Cargar();
            }
            if( jQuery('#pais_codigo').val()=='CR' ){
                jQuery('#pais_nombre').val('Costa Rica');
                jQuery('.documento').text('Número de Cédula');
                doc='Número de Cédula';
                jQuery('.gt').hide();
                ver='block';
                // BD_Cargar();
            }
            
        }
        else
            toastr['error'](data.message, 'Error');
    }).fail(function(err){
        console.log('Pais no se detectó');
    });

    BD_Cargar();


    function BD_Cargar(){//console.log('BD Cargada Exitosamente');
        jQuery('#exportar').attr('disabled','true');
            window.tabla_BD.clear().draw();
            jQuery('#loader').show();
            jQuery.ajax({
                url:'ws/travel/gastos/duplicados',  
                type:'POST',    
                dataType: 'json',
                data : {usuario: localStorage.USUARIO},
            }).done(function( data ){
                // console.log(data);
                // console.log(data.records.length-1);
                var consulta=data.records;
                todo=consulta;
                jQuery.each(consulta, function (inde, valo) { 
                    var contar = (valo.duplicadas.length-1);
                    jQuery.each(valo.duplicadas, function (index, valor) { 
                            encontro=1;
                            // console.log(valor);
                            console.log(valor.fecha)
                            jQuery('#exportar').removeAttr('disabled');
                            var esto = '';
                            var estos = '';
                            var row6 = '';
                            var row4 = '';
                            row1=valor.correlativo;
                            switch(valor.estado){
                                case 0: row6 = 'Pendiente'; esto=' - - - ';  estos=' - - - '; break;
                                case 1: row6 = 'Aprobada'; esto=valor.created;  estos=valo.jefe; break;
                                case 2: row6 = 'Rechazada'; esto=' - - - ';  estos=' - - - '; break;
                                case 9: row6 = 'Finalizada'; esto=' - - - ';  estos=' - - - '; break;
                                case 8: row6 = 'Eliminada'; esto=' - - - ';  estos=' - - - '; break;
                              }
                            ceco = valor.ceco;
                            justificacion = valor.justificacion;
                            factura = valo.factura;
                            row7=valor.cnta_gasto;
                            row8=valor.fecha;
                            row2=esto;
                            switch(valor.moneda){
                                case '0': row4 = 'Dolares'; break;
                                case '1': row4 = 'Colones'; break;
                                case '2': row4 = 'Quetzales'; break;
                              }
                            row3=valor.monton;
                            row5=valo.usuario;
                            row9=estos;
                            row10='<a data-placement="top" title="Ver" class="toltip btn-ver btn btn-info btn-xs" href="#modal-ver" data-toggle="modal" data-id="'+valor.foto+'"><i class="fa fa-eye"></i> Ver</a>';
                            window.tabla_BD.row.add([row1,row6,ceco,justificacion,factura,row7,row8,row2,row4,row3,row5,row9,row10]).draw(false);
                        if( contar == index )
                            jQuery('#loader').fadeOut();
                    });
                });

                    

            })
            .fail(function(error){console.log('error: ');console.log(error);jQuery('#loader').hide();})
            .always(function(){jQuery('#loader').fadeOut();});
            

                
        };
        

    jQuery('#exportar').on('click', function(e){
        e.preventDefault();
         window.location.href = "ws/travel/gastos/exportar/duplicados";
            toastr["success"]("Exportado correctamente", "Éxito");
            
    });

    jQuery('#tabla-registros').on('click', '.btn-ver', function(){//----------------------------------------------------->guarda la información de los gastos
        // jQuery('#loader').show();
        var id = jQuery(this).data('id');
        console.log(id);
        jQuery('#imagen').attr('src',id);
    });

    

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
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------->BOTONES

}
