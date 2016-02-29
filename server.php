<?php 
	include 'connect.php';

	$action = $_POST['action'];

	if ($action === 'removeTask') {

		$taskId = $_POST['taskId'];
		$projectId = $_POST['projectId'];

		$removeTask = mysql_query("DELETE FROM `tasks` WHERE `id` = $taskId and `project_id` = $projectId");

		if ($removeTask == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}
	} elseif ($action === 'removeProject') {
		$projectId = $_POST['projectId'];

		$removeProject = mysql_query("DELETE FROM `projects` WHERE `id` = $projectId");
		$removeTaskOfProject = mysql_query("DELETE FROM `tasks` WHERE `project_id` = $projectId");

		if ($removeProject == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}

		
	} elseif ($action === 'newProject') {
		$projectId = $_POST['projectId'];
		$projectName = $_POST['projectName'];

		$newProject = mysql_query("INSERT INTO `nucleoco_test`.`projects`(`id`, `name`) VALUES ('$projectId', '$projectName')");
		if ($newProject == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}
	
	} elseif ($action === 'newTask') {
		$projectId = $_POST['projectId'];
		$taskId = $_POST['taskId'];
		$taskName = $_POST['taskName'];

		$newTask = mysql_query("INSERT INTO `nucleoco_test`.`tasks`(`id`, `name`, `status`, `project_id`) VALUES ('$taskId','$taskName','false','$projectId')");
		if ($newTask == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}

	} elseif ($action === 'editProject') {
		
		$projectId = $_POST['projectId'];
		$projectName = $_POST['projectName'];

		$editProject = mysql_query("UPDATE `nucleoco_test`.`projects` SET `projects`.`name`= '$projectName' WHERE `id` = '$projectId'");
		if ($editProject == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}

	} elseif ($action === 'editTask') {
		$taskId = $_POST['taskId'];
		$projectId = $_POST['projectId'];
		$taskName = $_POST['taskName'];

		$editTask = mysql_query("UPDATE `nucleoco_test`.`tasks` SET `tasks`.`name`= '$taskName' WHERE `id` = '$taskId' and `project_id` = '$projectId'");
		if ($editTask == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}
	} elseif ($action === 'taskDone') {
		$taskId = $_POST['taskId'];
		$projectId = $_POST['projectId'];
		$status = $_POST['status'];

		$taskDone = mysql_query("UPDATE `nucleoco_test`.`tasks` SET `tasks`.`status`= '$status' WHERE `id` = '$taskId' and `project_id` = '$projectId'");
		if ($taskDone == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}
	} elseif ($action === 'taskIn') {
		$taskId = $_POST['taskId'];
		$projectId = $_POST['projectId'];
		$status = $_POST['status'];

		$taskDone = mysql_query("UPDATE `nucleoco_test`.`tasks` SET `tasks`.`status`= '$status' WHERE `id` = '$taskId' and `project_id` = '$projectId'");
		if ($taskDone == true) {
			echo "ok";
		} else {
			echo mysql_errno() . ": " . mysql_error();
		}
	}

?>