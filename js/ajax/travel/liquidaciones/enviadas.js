//Variables globales
    var Objeto = {};
    var DB = {};
    var CECO ='';
    var Orden ='';

jQuery( document ).ready( function( $ ){
    
    window.tablaAreas = $("#tlb-registros").DataTable({
        "columnDefs": [
            {
                "targets": [ 8 ],
                "visible": false,
                "searchable": false
            }
        ],
        "order": [[ 8, "desc" ]],
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

    //Funciones predeterminadas
    cargarBD( localStorage.USUARIO );
    asignacion( localStorage.USUARIO );

    //Funciones Determinadas
    $('#usuarios').on('change', function(){
         cargarBD( $('#usuarios').val() );
    });
    $("#tlb-registros").on('click', '.btn-imprimir', function(e){
        e.preventDefault();
        $('#loader').show();
        var json = JSON.stringify([{ id: $(this).data('id') }])

        $.ajax({
            url:        'ws/travel/liquidacion/imprimir',
            type:       'POST',
            dataType:   'json',
            data:       { json_pdf: json },                  
        }).done(function(data){
           // console.log(data.records)
            if( data.result){
                toastr['success']('Se envió correctamente su solicitud', 'Éxito');
                cargarBD( $('#usuarios').val());
            }else{
                toastr['warning'](data.message, 'Espere');
            }
        }).fail(function(err){
            console.log( err );
        }).always(function(){
            $('#loader').hide();
        });
    })

    //funciones
    function cargarBD( usuario ){  
        window.tablaAreas.clear().draw();
        $('#loader').show();
        $.ajax({
            url:        'ws/travel/liquidacion/historial/enviadas?usuario_email='+usuario,
            type:       'GET',
            dataType:   'json',
        }).done(function(data){
            if( data.result ){
                $.each( data.records, function( index,value ){ 
                    //console.log(value);
                    switch(parseInt(value.moneda)){
                        case 0: moneda='$'; break;
                        case 1: moneda='₡'; break;
                        case 2: moneda='Q'; break;
                    } 
                    counter1 = value.correlativo;
                    counter2 = value.nombre_creo;               
                    counter4 = value.justificacion;
                    counter5 = value.fecha_finalizacion;
                    counter6 = value.fecha_liquidacion;
                    counter7 = moneda+'. '+value.monto; 
                    if (value.estado == '1') {
                        counter3 = '';
                        counter8 = 'Aprobada';
                    } else if (value.estado == '2') {
                        counter3 = '';
                        counter8 = 'Rechazada';
                    }
                    else if (value.estado == '15') {
                        counter3 = '';
                        counter8 = 'Completada';
                    }
                    else if (value.estado == '0') {
                        counter3 = '';
                        counter8 = 'Pendiente';
                    }
                    else if (value.estado == '5' || value.estado == '7') {
                        counter3 = 'Faltan '+value.dias+' días';
                        counter8 = 'Enviada';
                    }else if (value.estado == '4') {
                        counter3 = 'Faltan '+value.dias+' días';
                        counter8 = 'Vencida';
                    }else
                    {
                        counter3 = 'Faltan '+value.dias+' días';
                        counter8 = '';
                    }
                    if (value.dias == 0) {
                        counter3 = '';
                    } 
                    counter9 = '<td>'+
                                    '<a role="button"  title="Imprimir la liquidación" style="margin-left: 5px;" class="btn btn-success btn-xs btn-imprimir" data-toggle="modal" data-id="'+value.id+'"><i class="fa fa-print"></i></a>'+
                                '</td>';
                    counter10 = value.created_at;
                    window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8,counter10,counter9]).draw(false);
                });
                $('.enabled').css( 'cursor', 'pointer' );
                $('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log(err);
        }).always( function(){
            $("#loader").fadeOut();
        });     
    }

    function asignacion( email ){ 
        $.ajax({
            type:       'PUT',
            url:        'ws/travel/liquidaciones/permisos?email='+email,
            dataType:   'json',
            data:       $('#form-editar').serialize()
        }).done(function(data){
            if( data.result ){
                $("#usuarios").empty();
                $('#usuarios').append('<option class="usuarios" selected="selected" value="'+localStorage.USUARIO+'">'+localStorage.NOMBRE_USUARIO+'</option>');
                $.each( data.records, function( index,valor ){
                    $('#usuarios').append('<option class="usuarios" value="'+valor.email_jefe+'">'+valor.nombre_jefe+'</option>');
                });
            }else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log( err );
        }).always( function(){
             // $('#usuarios').val(email);
        });  
    };


});