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
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body class="skin-megna-dark fixed-layout">
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
        <div class="page-wrapper">
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
                            <form class="form-material m-t-20">  
                               <div class="row form-group">
                                   <div class="table-responsive">
                                       <table class="table" id="history" style="width:100%">
                                           <thead>
                                               <tr>
                                                   <th>No</th>
                                                   <th>VM NAME</th>
                                                   <th>GROUP PRICE</th>
                                                   <th>ACTION</th>                                                
                                               </tr>
                                           </thead>
                                       </table>
                                   </div>
                               </div>
                           </form>
                        </div>
                    </div>
                    <!-- Column -->
                    <!-- Column -->
                    
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
                
                this.initial = function(){
                    
                  self.onLoadPage();
                }
            
               
                this.onLoadPage = function(){              
                    // var token = JSON.parse(sessionStorage.getItem('data')).token
                    $.ajax({
                        url: 'http://127.0.0.1/api/vm',
                        type: 'get',
                        cache: false,
                        // headers:{
                        //     'Authorization':'JWT '+token
                        // },
                        success: function(response){
                            console.log(response);
                            
                            self.createDataTable(response.DATA)

                            
                        

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

                this.createDataTable = function(response){
                    var table = $('table#history').DataTable({
                        data: response,
                        destroy: true,
                        rowId: 'ID',
                        bLengthChange : false,
                        bInfo : false,
                        iDisplayLength: 10,
                        responsive: true,
                        columns: [{
                            data: 'ID',
                            className: 'text-left',
                            render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },{
                            data: 'NAMEFILE',
                            className: 'text-left'
                        },{
                            data: 'GROUPPRICE',
                            className: 'text-left'
                        },{
                            data: 'ID',
                            className: 'text-center',
                            width: '15%',
                            render: function(data, type, full, meta) {
                                return data ?'<button type="button" id="btnInfo" class="btn btn-info "><i class="fa fa-fw fa-info" style="color:white"></i>':'';
                            }
                        }],
                      
                        fnDrawCallback: function (oSettings) {
                            $('.btn-info').click(function (e) {
                            var data = table.row( $(this).parents('tr') ).data();
                            // sessionStorage.setItem("HN",data.HN);
                            window.location.href="vminfo.php?id="+data.ID; 
                            })
                        }
                    });
                   
                }
           
            }
            $(document).ready(function () {
                patientInfo.initial();
                
            }); 
            
    </script>
   
</body>

</html>