<?php ?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Simple TODO List for RubyGarage</title>
	<script src="js/jquery-2.2.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/script.js"></script>
	<link rel="stylesheet" href="css/bootstrap-theme.min.css" />
	<link rel="stylesheet" href="css/bootstrap.min.css" />
	<link rel="stylesheet" href="css/style.css" />
</head>
<body>
	<h2 class="title">SIMPLE TODO LIST</h2>
	<div class="project-list">
		<?php 

		include 'connect.php';

		$qr_result = mysql_query("SELECT * FROM  `projects` ORDER BY `id`") or die(mysql_error());

		while($data = mysql_fetch_array($qr_result)){

			echo  "<div class='project' data-id='".$data["id"]."'>
						<div class='container'>
							<div class='navbar-header'>
								<span class='glyphicon glyphicon-calendar'></span>
								<span class='project-name'>".$data["name"]."</span>
							<div class='useful input-group edit-project'>
								<input type='text' class='form-control'>
								<span class='input-group-btn'>
									<button class='btn btn-danger' type='button'><span class='glyphicon glyphicon-remove'></span></button>
									<button class='btn btn-success' type='button'><span class='glyphicon glyphicon-ok'></span></button>
								</span>
							</div>
							<div class='tools-container project-tools' data-id='".$data["id"]."'>
								<span class='glyphicon glyphicon-pencil'></span>
								<span class='glyphicon glyphicon-trash'></span>
							</div>
						</div>
					</div>
					<div class='addTaskPanel'>
						<span class='glyphicon glyphicon-plus'></span>
						<div class='input-group new-task' data-id='".$data["id"]."'>
							<input placeholder='Start typing here to create a task...' type='text' class='form-control'>
							<span class='input-group-btn'>
								<button class='btn btn-success' type='button'>Add task</button>
							</span>
						</div>
					</div>
					<div class='task-container'>
						<div class='table-responsive'> 
							<table class='table table-bordered' data-id='".$data["id"]."'>";

			$param = $data["id"];
			$tasks = mysql_query("SELECT * FROM  `tasks` WHERE `project_id` = $param ORDER BY `id`") or die(mysql_error());
			
			while($task = mysql_fetch_array($tasks)){
				echo "<tr data-id='".$task["id"]."'><td class='col-xs-1'>";
				if ($task["status"] === 'false') {
					echo "<div class='checkbox'><label><input type='checkbox'";
				} elseif ($task["status"] === 'true') {
					echo "<div class='checkbox'><label><input type='checkbox' checked";
				} 
				echo " value=''></label></div></td>
					  <td class='col-xs-9'>
					  	<span class='task-text'>".$task["name"]."</span>
					  	<div class='task-edit input-group'>
					    <input type='text' class='form-control'>
					    <span class='input-group-btn'>
					      <button class='btn btn-danger' type='button'><span class='glyphicon glyphicon-remove'></span></button>
					      <button class='btn btn-success' type='button'><span class='glyphicon glyphicon-ok'></span></button>
					    </span>
					  </td>
					  <td class='col-xs-2'>
							<div class='tools-container'>
								<span class='glyphicon glyphicon-pencil'></span>
								<span class='glyphicon glyphicon-trash'></span>
							</div>
					  </td>	
					</tr>";
			}
				echo "</table>
					</div>
				</div>
			</div>";
		}
			echo "</div>";

		?>
	<button type="button" class="btn add-list btn-lg"><span class="glyphicon glyphicon-plus"></span>Add TODO List</button>
	<div class="col-lg-12 col-md-12 new-project">
		<div class="useful input-group">
		    <input type="text" class="form-control">
		    <span class="input-group-btn edit-project">
		      <button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button>
		      <button class="btn btn-success" type="button"><span class="glyphicon glyphicon-ok"></span></button>
		    </span>
	    </div>       
    </div>
	<div class="alert alert-danger"></div>
	<div class="sign">© <a target='_blank' href="http://yershovkiril.github.io">Kiril Yershov</a></div>
</body>
</html>