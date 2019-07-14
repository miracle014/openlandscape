<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicon.png">
    <title>Elite Admin Template - The Ultimate Multipurpose admin template</title>
    <!-- This page CSS -->
    <!-- chartist CSS -->
    <link href="./assets/node_modules/morrisjs/morris.css" rel="stylesheet">
    <!--Toaster Popup message CSS -->
    <link href="./assets/node_modules/toast-master/css/jquery.toast.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="dist/css/style.min.css" rel="stylesheet">
    <!-- Dashboard 1 Page CSS -->
    <link href="dist/css/pages/dashboard1.css" rel="stylesheet">
    <link href="../assets/node_modules/dropzone-master/dist/dropzone.css" rel="stylesheet" type="text/css" />
    <link href="dist/css/pages/progressbar-page.css" rel="stylesheet">
    <link href="dist/css/pages/widget-page.css" rel="stylesheet">

    <link href="./assets/node_modules/chartist-js/dist/chartist.min.css" rel="stylesheet">
    <!-- <link href="./assets/node_modules/chartist-js/dist/chartist-init.css" rel="stylesheet"> -->
    <link href="./assets/node_modules/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.css" rel="stylesheet">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body class="skin-blue-dark fixed-layout">
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <div class="preloader">
        <div class="loader">
            <div class="loader__figure"></div>
            <p class="loader__label">Openlandscape</p>
        </div>
    </div>
    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <div id="main-wrapper">

        <!-- ============================================================== -->
        <!-- Topbar header - style you can find in pages.scss -->
        <!-- ============================================================== -->
       <?php 
            include 'dist/php/header.php';
        ?>
        <!-- ============================================================== -->
        <!-- End Topbar header -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <?php
            include 'dist/php/left-sidebar.php';
        ?>
        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div id="page-wrapper" class="page-wrapper">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <!-- ============================================================== -->
            <div class="container-fluid">
                <!-- ============================================================== -->
                <!-- Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">Dashboard</h4>
                        
                    </div>
                    <div class="col-md-7 align-self-center text-right">
                        <div class="d-flex justify-content-end align-items-center">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                            <li class="breadcrumb-item active">Dashboard </li>
                        </ol>
                            
                        <button type="button" class="btn btn-info d-none d-lg-block m-l-15"><i class="fa fa-plus-circle"></i> Create New</button>
                         
                        </div>    
                    </div>
                    

                </div>
                <!-- ============================================================== -->
                <!-- End Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Info box -->
                <!-- ============================================================== -->
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <div class="row ">
                                <div class="col-12 text-center">
                                    <h4 id="name-vm"></h4>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div>
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>CPU_USAGE (%)</h3>
                                            <div id="ct-cpu" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>MEMORY_USAGE (MB)</h3>
                                            <div id="ct-ram" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div>
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>IOPs_Disk_write</h3>
                                            <div id="ct-d-w" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>IOPs_Disk_read</h3>
                                            <div id="ct-d-r" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div>
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>TX_total (kbps)</h3>
                                            <div id="ct-tx-t" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>TX_error (kbps)</h3>
                                            <div id="ct-tx-e" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div>
                <div class="card-group">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>RX_total (kbps)</h3>
                                            <div id="ct-rx-t" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h3>RX_error (kbps)</h3>
                                            <div id="ct-rx-e" style="height: 200px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                </div>
              
                    
                </div>
               
                <!-- ============================================================== -->
                <!-- End Comment - chats -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Over Visitor, Our income , slaes different and  sales prediction -->
                <!-- ============================================================== -->
                
                </div>
                <!-- ============================================================== -->
                <!-- End Page Content -->
                <!-- ============================================================== -->
                
                <!-- ============================================================== -->
                <!-- Right sidebar -->
                <!-- ============================================================== -->
               
                <!-- ============================================================== -->
            </div>
            <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== -->
            
        </div>
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- footer -->
        <!-- ============================================================== -->
       <?php
            include 'dist/php/footer.php';
        ?>
        <!-- ============================================================== -->
        <!-- End footer -->
        <!-- ============================================================== -->
    </div>
    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="./assets/node_modules/jquery/jquery-3.2.1.min.js"></script>
    <!-- Bootstrap popper Core JavaScript -->
    <script src="./assets/node_modules/popper/popper.min.js"></script>
    <script src="./assets/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="dist/js/perfect-scrollbar.jquery.min.js"></script>
    <!--Wave Effects -->
    <script src="dist/js/waves.js"></script>
    <!--Menu sidebar -->
    <script src="dist/js/sidebarmenu.js"></script>
    <!--Custom JavaScript -->
    <script src="dist/js/custom.min.js"></script>
    <!-- ============================================================== -->
    <!-- This page plugins -->
    <!-- ============================================================== -->
    <!--morris JavaScript -->
    <script src="./assets/node_modules/raphael/raphael-min.js"></script>
    <script src="./assets/node_modules/morrisjs/morris.min.js"></script>
    <script src="./assets/node_modules/jquery-sparkline/jquery.sparkline.min.js"></script>
   
    <!-- Popup message jquery -->
    <script src="./assets/node_modules/toast-master/js/jquery.toast.js"></script>
    <!-- Chart JS -->
    <script src="dist/js/dashboard1.js"></script>
    <script src="./assets/node_modules/toast-master/js/jquery.toast.js"></script>
    <!-- <script src="../assets/node_modules/dropzone-master/dist/dropzone.js"></script> -->

    <script src="./assets/node_modules/chartist-js/dist/chartist.min.js"></script>
    <script src="./assets/node_modules/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.min.js"></script>
    <!-- <script src="./assets/node_modules/chartist-js/dist/chartist-init.js"></script> -->
    <script src="./assets/node_modules/gauge/gauge.min.js"></script>
    <script src="./assets/node_modules/datatables/datatables.js"></script>
    <script src="dist/plugin/dropzone.js"></script>
    <script src="dist/plugin/FileSaver.js"></script>
    <script src="dist/js/pages/widget-data.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.6/dist/loadingoverlay.min.js"></script>


    <script type="text/javascript">
            var patientInfo = new patientInfo();
            function patientInfo(){
                var self = this;
                var $formLogin = $('form#loginform');
                var params = new window.URLSearchParams(window.location.search);
                this.initial = function(){
                    
                  self.onLoadPage();               
                }
                this.genChart = function(attr,data){
                    var chart = new Chartist.Line(attr, {
                                labels: ['00:00-04:59', '05:00-08:59', '09:00-12:59', '13:00-16:59', '17.00-20.59', '21:00-23:59'],
                                series: data
                                }, {
                                    fullWidth: true,
                                    plugins: [
                                        Chartist.plugins.tooltip()
                                    ],
                                    low: 0
                                });

                                // Let's put a sequence number aside so we can use it in the event callbacks
                                var seq = 0,
                                delays = 80,
                                durations = 500;

                                // Once the chart is fully created we reset the sequence
                                chart.on('created', function() {
                                seq = 0;
                                });

                                // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
                                chart.on('draw', function(data) {
                                seq++;

                                if(data.type === 'line') {
                                    // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                                    data.element.animate({
                                    opacity: {
                                        // The delay when we like to start the animation
                                        begin: seq * delays + 1000,
                                        // Duration of the animation
                                        dur: durations,
                                        // The value where the animation should start
                                        from: 0,
                                        // The value where it should end
                                        to: 1
                                    }
                                    });
                                } else if(data.type === 'label' && data.axis === 'x') {
                                    data.element.animate({
                                    y: {
                                        begin: seq * delays,
                                        dur: durations,
                                        from: data.y + 100,
                                        to: data.y,
                                        // We can specify an easing function from Chartist.Svg.Easing
                                        easing: 'easeOutQuart'
                                    }
                                    });
                                } else if(data.type === 'label' && data.axis === 'y') {
                                    data.element.animate({
                                    x: {
                                        begin: seq * delays,
                                        dur: durations,
                                        from: data.x - 100,
                                        to: data.x,
                                        easing: 'easeOutQuart'
                                    }
                                    });
                                } else if(data.type === 'point') {
                                    data.element.animate({
                                    x1: {
                                        begin: seq * delays,
                                        dur: durations,
                                        from: data.x - 10,
                                        to: data.x,
                                        easing: 'easeOutQuart'
                                    },
                                    x2: {
                                        begin: seq * delays,
                                        dur: durations,
                                        from: data.x - 10,
                                        to: data.x,
                                        easing: 'easeOutQuart'
                                    },
                                    opacity: {
                                        begin: seq * delays,
                                        dur: durations,
                                        from: 0,
                                        to: 1,
                                        easing: 'easeOutQuart'
                                    }
                                    });
                                } else if(data.type === 'grid') {
                                    // Using data.axis we get x or y which we can use to construct our animation definition objects
                                    var pos1Animation = {
                                    begin: seq * delays,
                                    dur: durations,
                                    from: data[data.axis.units.pos + '1'] - 30,
                                    to: data[data.axis.units.pos + '1'],
                                    easing: 'easeOutQuart'
                                    };

                                    var pos2Animation = {
                                    begin: seq * delays,
                                    dur: durations,
                                    from: data[data.axis.units.pos + '2'] - 100,
                                    to: data[data.axis.units.pos + '2'],
                                    easing: 'easeOutQuart'
                                    };

                                    var animations = {};
                                    animations[data.axis.units.pos + '1'] = pos1Animation;
                                    animations[data.axis.units.pos + '2'] = pos2Animation;
                                    animations['opacity'] = {
                                    begin: seq * delays,
                                    dur: durations,
                                    from: 0,
                                    to: 1,
                                    easing: 'easeOutQuart'
                                    };

                                    data.element.animate(animations);
                                }
                                });

                     

                    
                }
            
               
                this.onLoadPage = function(){              
                    // var token = JSON.parse(sessionStorage.getItem('data')).token
                    $.ajax({
                        url: 'http://127.0.0.1/api/vm/'+params.get('id'),
                        type: 'get',
                        cache: false,
                        // headers:{
                        //     'Authorization':'JWT '+token
                        // },
                        success: function(response){
                            console.log(response);
                            let data = response.DATA
                            let max ,min,mean ;
                            $('#name-vm').text(data.NAMEFILE)

                            max = [data.MAX11.toFixed(2),data.MAX12.toFixed(2),data.MAX13.toFixed(2),data.MAX14.toFixed(2),data.MAX15.toFixed(2),data.MAX16.toFixed(2)]
                            min = [data.MIN11.toFixed(2),data.MIN12.toFixed(2),data.MIN13.toFixed(2),data.MIN14.toFixed(2),data.MIN15.toFixed(2),data.MIN16.toFixed(2)]
                            mean = [data.AVG11.toFixed(2),data.AVG12.toFixed(2),data.AVG13.toFixed(2),data.AVG14.toFixed(2),data.AVG15.toFixed(2),data.AVG16.toFixed(2)]
                            self.genChart('#ct-cpu',[max,min,mean]);

                            max = [data.MAX21.toFixed(2),data.MAX22.toFixed(2),data.MAX23.toFixed(2),data.MAX24.toFixed(2),data.MAX25.toFixed(2),data.MAX26.toFixed(2)]
                            min = [data.MIN21.toFixed(2),data.MIN22.toFixed(2),data.MIN23.toFixed(2),data.MIN24.toFixed(2),data.MIN25.toFixed(2),data.MIN26.toFixed(2)]
                            mean = [data.AVG21.toFixed(2),data.AVG22.toFixed(2),data.AVG23.toFixed(2),data.AVG24.toFixed(2),data.AVG25.toFixed(2),data.AVG26.toFixed(2)]
                            self.genChart('#ct-ram',[max,min,mean]);

                            max = [data.MAX31.toFixed(2),data.MAX32.toFixed(2),data.MAX33.toFixed(2),data.MAX34.toFixed(2),data.MAX35.toFixed(2),data.MAX36.toFixed(2)]
                            min = [data.MIN31.toFixed(2),data.MIN32.toFixed(2),data.MIN33.toFixed(2),data.MIN34.toFixed(2),data.MIN35.toFixed(2),data.MIN36.toFixed(2)]
                            mean = [data.AVG31.toFixed(2),data.AVG32.toFixed(2),data.AVG33.toFixed(2),data.AVG34.toFixed(2),data.AVG35.toFixed(2),data.AVG36.toFixed(2)]
                            self.genChart('#ct-d-w',[max,min,mean]);

                            max = [data.MAX41.toFixed(2),data.MAX42.toFixed(2),data.MAX43.toFixed(2),data.MAX44.toFixed(2),data.MAX45.toFixed(2),data.MAX46.toFixed(2)]
                            min = [data.MIN41.toFixed(2),data.MIN42.toFixed(2),data.MIN43.toFixed(2),data.MIN44.toFixed(2),data.MIN45.toFixed(2),data.MIN46.toFixed(2)]
                            mean = [data.AVG41.toFixed(2),data.AVG42.toFixed(2),data.AVG43.toFixed(2),data.AVG44.toFixed(2),data.AVG45.toFixed(2),data.AVG46.toFixed(2)]
                            self.genChart('#ct-d-r',[max,min,mean]);

                            max = [data.MAX51.toFixed(2),data.MAX52.toFixed(2),data.MAX53.toFixed(2),data.MAX54.toFixed(2),data.MAX55.toFixed(2),data.MAX56.toFixed(2)]
                            min = [data.MIN51.toFixed(2),data.MIN52.toFixed(2),data.MIN53.toFixed(2),data.MIN54.toFixed(2),data.MIN55.toFixed(2),data.MIN56.toFixed(2)]
                            mean = [data.AVG51.toFixed(2),data.AVG52.toFixed(2),data.AVG53.toFixed(2),data.AVG54.toFixed(2),data.AVG55.toFixed(2),data.AVG56.toFixed(2)]
                            self.genChart('#ct-tx-t',[max,min,mean]);

                            max = [data.MAX61.toFixed(2),data.MAX62.toFixed(2),data.MAX63.toFixed(2),data.MAX64.toFixed(2),data.MAX65.toFixed(2),data.MAX66.toFixed(2)]
                            min = [data.MIN61.toFixed(2),data.MIN62.toFixed(2),data.MIN63.toFixed(2),data.MIN64.toFixed(2),data.MIN65.toFixed(2),data.MIN66.toFixed(2)]
                            mean = [data.AVG61.toFixed(2),data.AVG62.toFixed(2),data.AVG63.toFixed(2),data.AVG64.toFixed(2),data.AVG65.toFixed(2),data.AVG66.toFixed(2)]
                            self.genChart('#ct-tx-e',[max,min,mean]);

                            max = [data.MAX71.toFixed(2),data.MAX72.toFixed(2),data.MAX73.toFixed(2),data.MAX74.toFixed(2),data.MAX75.toFixed(2),data.MAX76.toFixed(2)]
                            min = [data.MIN71.toFixed(2),data.MIN72.toFixed(2),data.MIN73.toFixed(2),data.MIN74.toFixed(2),data.MIN75.toFixed(2),data.MIN76.toFixed(2)]
                            mean = [data.AVG71.toFixed(2),data.AVG72.toFixed(2),data.AVG73.toFixed(2),data.AVG74.toFixed(2),data.AVG75.toFixed(2),data.AVG76.toFixed(2)]
                            self.genChart('#ct-rx-t',[max,min,mean]);

                            max = [data.MAX81.toFixed(2),data.MAX82.toFixed(2),data.MAX83.toFixed(2),data.MAX84.toFixed(2),data.MAX85.toFixed(2),data.MAX86.toFixed(2)]
                            min = [data.MIN81.toFixed(2),data.MIN82.toFixed(2),data.MIN83.toFixed(2),data.MIN84.toFixed(2),data.MIN85.toFixed(2),data.MIN86.toFixed(2)]
                            mean = [data.AVG81.toFixed(2),data.AVG82.toFixed(2),data.AVG83.toFixed(2),data.AVG84.toFixed(2),data.AVG85.toFixed(2),data.AVG86.toFixed(2)]
                            self.genChart('#ct-rx-e',[max,min,mean]);
                        

                        },
                        error: function(response){
                            Swal.fire(
                                'พบข้อผิดพลาด',
                                'กรุณาตรวจสอบข้อมูลอีกครั้ง',
                                'error'
                                )                             
                            
                        }
                    });
                }

                // this.createDataTable = function(response){
                //     var table = $('table#history').DataTable({
                //         data: response,
                //         destroy: true,
                //         rowId: 'ID',
                //         bLengthChange : false,
                //         bInfo : false,
                //         iDisplayLength: 10,
                //         responsive: true,
                //         columns: [{
                //             data: 'ID',
                //             className: 'text-left',
                //             render: function (data, type, row, meta) {
                //             return meta.row + meta.settings._iDisplayStart + 1;
                //             }
                //         },{
                //             data: 'NAMEFILE',
                //             className: 'text-left'
                //         },{
                //             data: 'GROUPPRICE',
                //             className: 'text-left'
                //         },{
                //             data: 'ID',
                //             className: 'text-center',
                //             width: '15%',
                //             render: function(data, type, full, meta) {
                //                 return data ?'<button type="button" id="btnInfo" class="btn btn-info "><i class="fa fa-fw fa-info" style="color:white"></i>':'';
                //             }
                //         }],
                      
                //         fnDrawCallback: function (oSettings) {
                          
                //         }
                //     });
                // }
           
            }
            $(document).ready(function () {
                patientInfo.initial();
                
            }); 
            
    </script>
   
</body>

</html>