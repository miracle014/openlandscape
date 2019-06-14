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
                            <div class="row">
                                 <div class="col-md-12"> 
                                     <div class="d-flex no-block align-items-center">
                                         <div>
                                            <h3><i class="fas fa-upload"></i></h3>
                                            <p class="text-muted">Upload log file</p>
                                         </div>
                                         <div class="ml-auto">
                                            <h2 id="countFile" class="counter text-primary">0</h2>
                                        </div>     
                                     </div>   
                                </div>
                                <div class="col-12">
                                    <div class="progress ">
                                    <div class="progress-bar bg-success" id="progressbar" role="progressbar" style="width: 0%;height:15px;" role="progressbar"> 0% </div>
                                    </div>
                                    <div id="dropzone" class="dropzone">
                                        <div class="fallback">
                                            <input name="file" type="file" class="fileinput-button" multiple />
                                        </div>
                                    </div>
                                </div>
                            </div>
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

    <script src="dist/plugin/dropzone.js"></script>
    <script src="dist/plugin/FileSaver.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.6/dist/loadingoverlay.min.js"></script>


    <script type="text/javascript">
        Dropzone.autoDiscover = false;
        $(document).ready(function () {
            $("div#dropzone").dropzone(
                {
                    url: "http://127.0.0.1/api/uploads/csv", // Set the url
                    timeout: 1000000000,
                    parallelUploads: 100,
                    uploadMultiple: true,
                    maxFiles: 100,
                    acceptedFiles: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                    init: function () {
                        
                        var totalFiles = 0,
                            completeFiles = 0;
                        this.on("addedfile", function (file) {
                            totalFiles += 1;
                        });
                        this.on("removed file", function (file) {
                            totalFiles -= 1;
                        });
                        this.on("sendingmultiple", function(file, xhr, data) {
                            $.LoadingOverlay("show");
                            xhr.responseType = 'blob';
                            xhr.onload = function () {
                                if (this.status === 200) {
                                    var filename = "";
                                    var disposition = xhr.getResponseHeader('Content-Disposition');
                                    if (disposition && disposition.indexOf('attachment') !== -1) {
                                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                                        var matches = filenameRegex.exec(disposition);
                                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                                    }
                                    var type = xhr.getResponseHeader('Content-Type');

                                    var blob = typeof File === 'function' ? new File([this.response], filename, { type: type }) : new Blob([this.response], { type: type });
                                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                                        window.navigator.msSaveBlob(blob, filename);
                                    } else {
                                        var URL = window.URL || window.webkitURL;
                                        var downloadUrl = URL.createObjectURL(blob);
                                        if (filename) {
                                            // use HTML5 a[download] attribute to specify filename
                                            var a = document.createElement("a");
                                            // safari doesn't support this yet
                                            if (typeof a.download === 'undefined') {
                                                window.location = downloadUrl;
                                            } else {
                                                a.href = downloadUrl;
                                                a.download = filename;
                                                document.body.appendChild(a);
                                                a.click();
                                               
                                            }
                                        } else {
                                            window.location = downloadUrl;
                                        }

                                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                                    }
                                }else{
                                   
                                }
                                $.LoadingOverlay("hide");
                                Dropzone.forElement('#dropzone').removeAllFiles(true)
                                
                            }
                          
                           
                        });
                        this.on("complete", function (file) {
                            completeFiles += 1;
                            let persen = (completeFiles*100)/totalFiles
                            $('#progressbar').css('width',`${persen}%`)
                            $('#progressbar').text(`${persen}%`)
                            if (completeFiles === totalFiles) {
                               $("#countFile").text("VM : "+completeFiles)
                               
                            }
                            
                            
                        });
                        this.on("successmultiple", function (file,response) {
                            
                            Dropzone.forElement('#dropzone').removeAllFiles(true)
                            
                            totalFiles = 0,
                            completeFiles = 0;
                            
                         
                        });

                        
                    }
                }
                );
        });
           
   </script>
   
</body>

</html>