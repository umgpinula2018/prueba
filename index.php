<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Cotizador</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="FIFCO One">
	<meta name="author" content="Saprosa">
	<link rel="icon" type="image/png" href="images/logo-ico.png"/>
	<link rel="stylesheet" href="css/font-awesome.css" type="text/css">
	<link rel="stylesheet" href="css/bootstrap.css" type="text/css">
	<link rel="stylesheet" href="css/animate.css" type="text/css">
	<link rel="stylesheet" href="css/waves.css" type="text/css">
	<link rel="stylesheet" href="css/layout.css" type="text/css">
	<link rel="stylesheet" href="css/components.css" type="text/css">
	<link rel="stylesheet" href="css/plugins.css" type="text/css">
	<link rel="stylesheet" href="css/common-styles.css" type="text/css">
	<link rel="stylesheet" href="css/responsive.css" type="text/css">
	<link rel="stylesheet" href="css/matmix-iconfont.css" type="text/css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,300,400italic,500,500italic" type="text/css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" type="text/css">
	<link rel="stylesheet" href="js/toastr.js" />
	<link href="css/toastr.css" rel="stylesheet">	
	<link rel="stylesheet" href="css/bootstrap-timepicker.min.css" type="text/css">
	<link rel="stylesheet" href="css/datepicker.css" type="text/css"/>
	<link rel="stylesheet" href="css/chosen.css" type="text/css"/>
	<link rel="stylesheet" href="css/loader.css" type="text/css"/>
	<!-- DROPZONE -->
	<link rel="stylesheet" href="css/dropzone.css">
	<link rel="stylesheet" href="css/bootstrap-tagsinput.css">
	<link rel="stylesheet" href="css/pages.css" type="text/css">
	<!-- Full Calendario -->
	<link rel="stylesheet" href="js/fullcalendar/fullcalendar.css">
</head>
<body>
<div class="section-header">
	<h2>Contratos</h2>
	<a id="btn-nuevo" href="#modal-crear" role="button" data-toggle="modal" class="btn btn-primary"><i class="fa fa-plus"></i>  Crear contrato</a>
</div>
<div class="box-widget widget-module">
	<div class="widget-head clearfix">
		<span class="h-icon"><i class="fa fa-th"></i></span>
		<h4>Lista de contratos</h4>
	</div>
	<div class="widget-container">
		<div class=" widget-block">
			<table class="table dt-table-export datatable" id="tabla-registros">
				<thead>
					<tr>
						<th>#</th>
						<th>descripcion</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal Crear Registro -->
<div class="modal fade" id="modal-crear" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Nuevo contrato</h4>
			</div>
			<div class="modal-body">
				<form id="form-crear" class="form"  method="post" enctype="multipart/form-data">
			        <fieldset>
						<div class="form-group">
						    <label>Nombre: </label>
						    <input type="text" class="form-control" id="descripcion" name="descripcion" required>
						</div>
						<div class="form-group">
						    <label>Archivo: </label>
						    <input type="file" name="adjuntos" id="adjuntos" required/>
						</div>
			        </fieldset>
		        </form>
			</div>
			<div class="modal-footer">
				<button id="btn-crear" class="btn btn-success" aria-hidden="true">Registrar</button>
				<button class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Cerrar</button>
			</div>
		</div>
	</div>
</div>

<!-- Modal editar registro -->
<div class="modal fade" id="modal-editar" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Actualizar contrato</h4>
			</div>
			<div class="modal-body">
				<form id="form-editar" class="form" method="post" enctype="multipart/form-data">
			        <fieldset>
						<div class="form-group">
						    <label>Nombre: </label>
						    <input type="text" class="form-control" name="descripcion" id="descripcion" required>
						</div>
						<div class="form-group">
						    <label>Archivo: </label>
						    <input type="file" name="adjuntos" id="adjuntos" />
						</div>
			        </fieldset>
		        </form>
			</div>
			<div class="modal-footer">
				<button id="btn-actualizar" class="btn btn-success" aria-hidden="true">Actualizar</button>
				<button class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Cerrar</button>
			</div>
		</div>
	</div>
</div>

<!-- Modal Eliminar Registro -->
<div class="modal fade" id="modal-eliminar" data-easein="pulse" tabindex="-1" role="dialog" aria-labelledby="editarRegistro" aria-hidden="true">>
  	<div class="modal-dialog" role="document">
    	<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Eliminar contrato</h4>
			</div>
	  		<div class="modal-body">
		  		<h3>¿Realmente desea eliminar este contrato?</h3>
    		</div>
			<div class="modal-footer">
	  			<button id="btn-eliminar" class="btn btn-danger" aria-hidden="true">Eliminar</button>
					<button class="btn btn-success" data-dismiss="modal" aria-hidden="true">Cerrar</button>
			</div>	
		</div>
	</div>
</div>
<script src="js/jquery-1.11.2.min.js"></script>
	<script src="js/jquery-migrate-1.2.1.min.js"></script>
	<script src="js/jRespond.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/nav-accordion.js"></script>
	<script src="js/hoverintent.js"></script>
	<script src="js/waves.js"></script>
	<script src="js/switchery.js"></script>
	<script src="js/jquery.loadmask.js"></script>
	<script src="js/icheck.js"></script>
	<script src="js/select2.js"></script>
	<script src="js/bootstrap-filestyle.js"></script>
	<script src="js/bootbox.js"></script>
	<!--<script src="js/animation.js"></script>-->
	<script src="js/colorpicker.js"></script>
	<script src="js/bootstrap-datepicker.js"></script>
	<script src="js/sweetalert.js"></script>
	<script src="js/moment-with-locales.js"></script>
	<!--Full Calendar
	<script src="js/calendar/fullcalendar.js"></script>
	<script src="js/calendar/lang/es.js"></script>
	-->
	<script src="js/fullcalendar/lib/moment.min.js"></script>
	<script src="js/fullcalendar/fullcalendar.js"></script>
	<script src='js/fullcalendar/locale/es.js'></script>
	<!--Data Tables-->
	<script src="js/jquery.dataTables.js"></script>
	<script src="js/dataTables.responsive.js"></script>
	<script src="js/dataTables.tableTools.js"></script>
	<script src="js/dataTables.bootstrap.js"></script>
	<script src="js/stacktable.js"></script>
	<!--CHARTS-->
	<script src="js/chart/sparkline/jquery.sparkline.js"></script>
	<script src="js/chart/easypie/jquery.easypiechart.min.js"></script>
	<script src="js/chart/flot/excanvas.min.js"></script>
	<script src="js/chart/flot/jquery.flot.min.js"></script>
	<script src="js/chart/flot/jquery.flot.time.min.js"></script>
	<script src="js/chart/flot/jquery.flot.stack.min.js"></script>
	<script src="js/chart/flot/jquery.flot.axislabels.js"></script>
	<script src="js/chart/flot/jquery.flot.resize.min.js"></script>
	<script src="js/chart/flot/jquery.flot.tooltip.min.js"></script>
	<script src="js/chart/flot/jquery.flot.spline.js"></script>
	<script src="js/chart/flot/jquery.flot.pie.min.js"></script>
	<script src="js/chart.init.js"></script>
	<script src="js/smart-resize.js"></script>
	<script src="js/layout.init.js"></script>
	<script src="js/matmix.init.js"></script>
	<script src="js/retina.min.js"></script>
	<script src="js/fifcoone.js"></script>
	<script src="js/chart/flot/curvedLines.js"></script>
	<script src="js/toastr.js"></script>
	<script src="js/jquery.validate.min.js"></script>
	<script src="js/bootstrap-timepicker.min.js"></script>
	<script src="js/chosen.jquery.js"></script>
	<script src="js/summernote.min.js"></script>
	<script src="js/jquery.noty.js"></script>
	<script src="js/ajax/index.js"></script>
	<!--<script type="text/javascript" src="js/ajax/change_data_travel.js"></script>-->
	<script type="text/javascript" src="js/jquery.mask.js"></script>
	<!-- DROPZONE -->
	<script src="js/dropzone.js"></script>
	<script src="js/bootstrap-tagsinput.min.js"></script>
	<script src="https://cdn.datatables.net/buttons/1.4.2/js/dataTables.buttons.min.js"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
	<script type="text/javascript">
		jQuery( document ).ready( function( $ )
		{
			$('#loader').show();
		});	
	</script>
</body>
</html>
