(function() {
		'use strict';

		$(document).ready(function() {

			function TodoList() {
				$('.container').each(function(index, elem) {
					$(elem).on("mouseover", function(element) {
						var d = element.target;
						if (d.className === 'container') {
							d.getElementsByClassName('tools-container')[0].style.display = 'block';
						}
					});
					$(elem).on("mouseleave", function(element) {
						var d = element.target;
						if (d.className === 'container') {
							d.getElementsByClassName('tools-container')[0].style.display = 'none';
						}
					});
				});

				$('tr').each(function(index, elem) {
					$(elem).on("mouseover", function(element) {
						var d = element.target.parentElement;
						if (d.tagName === "TR") {
							d.getElementsByClassName('tools-container')[0].style.display = 'block';
						}
					});
					$(elem).on("mouseleave", function(element) {
						var d = element.target.parentElement;
						if (d.tagName === "TR") {
							d.getElementsByClassName('tools-container')[0].style.display = 'none';
						}
					});
				});

				$('.add-list').on('click', function() {
					resetTask();
					$('.new-project').css('display', 'block');
					$('.add-list').css('display', 'none');
				});

				$('.new-project .btn-danger').on('click', function() {
					$('.new-project input[type="text"]').val('');
					$('.new-project').css('display', 'none');
					$('.add-list').css('display', 'block');
				});


				$('.glyphicon-pencil').on('click', function(event) {
					resetTask();
					var _this = $('.tools-container:visible').parent('');
					if ($('.useful:visible').length > 0) {
						var parentNode = $('.useful:visible').parent();
						saveProjectName(parentNode);
						$('.useful:visible').css('display', 'none');
					}
					// tools-panel проекта
					if ($(_this).has('.project-name').length > 0) {
						$(_this).children('.project-name').css('display', 'none');
						$(_this).children('.edit-project').css('display', 'inline-table');
					} 
				});

				$('.task-container .glyphicon-pencil').on('click', function(e) {
					resetTask();
					var str = e.target.parentElement.parentElement.parentElement;
					var taskId = $(str).attr('data-id');
					var projectId = $(str).parent().parent().attr('data-id');
					var textNode = $(str).children().children('.task-text');
					var text = $(textNode).text();
					$(textNode).css('display', 'none');
					$(str).children().children('.task-edit').css('display', 'inline-table');
					$('.task-edit:visible input').val(text);
					successEditTask(text, projectId, textNode, str, taskId);
				});

				$('.task-container .glyphicon-trash').on('click', function(e) {
					var str = e.target.parentElement.parentElement.parentElement;
					var taskId = $(str).attr('data-id');
					var projectId = $(str).parent().parent().attr('data-id');
					$(str).remove();
					// запрос в БД на удаление элемента
					var query = "action=removeTask&taskId="+ taskId + "&projectId=" + projectId;
					$.ajax({
						url: 'server.php',
						type: 'POST',
						data: query,
						success: function(data) {
							console.log(data);
						}
					});
				});

				$('.task-edit .btn-danger').on('click', function(e) {
					resetTask();
					$('.alert-danger').css('display', 'none');
					$('.error-text').remove();
				});

				$('.useful .btn-danger').on('click', function(element) {
					var parentNode = $('.useful:visible').parent();
					saveProjectName(parentNode);
					$('.useful:visible').css('display', 'none');
					$('.alert-danger').css('display', 'none');
					$('.error-text').remove();
				});

				

				$('.glyphicon-trash').on('click', function(e) {
					var parentNode = e.target.parentElement;
					if (parentNode.className.indexOf('project-tools') > -1) {
						var dataId = ($(parentNode).attr('data-id'));
						$('.project').each(function(i, e) {
							if ($(e).attr('data-id') === dataId) {
								$(e).remove();
								// запрос в БД на удаление данного проекта из таблиц (id проекта записан в dataId)
								var query = "action=removeProject&projectId=" + dataId;
								$.ajax({
									url: 'server.php',
									type: 'POST',
									data: query,
									success: function(data) {
										console.log(data);
									}
								});
							}
						});
					}
				});

				$('input[type="checkbox"]').on('click', function(e) {
					var parentNode = $(e.target).parent().parent().parent().parent('tr');
					var taskId = $(parentNode).attr('data-id');
					var projectId = $(parentNode).parent().parent().attr('data-id');
					if (e.target.checked) {
						$(parentNode).addClass('task-complete');
						var query = "action=taskDone&projectId=" + projectId + "&status=true&taskId=" + taskId;
						$.ajax({
							url: 'server.php',
							type: 'POST',
							data: query,
							success: function(data) {
								console.log(data);
							}
						});		
					} else {
						$(parentNode).removeClass('task-complete');
						var query = "action=taskIn&projectId=" + projectId + "&status=false&taskId=" + taskId;
						$.ajax({
							url: 'server.php',
							type: 'POST',
							data: query,
							success: function(data) {
								console.log(data);
							}
						});		
					}

					//запись в БД статус задачи
				})

				
			}

			function successEditTask(text, projectId, textNode, str, taskId) {
				$('.task-edit .btn-success').off('click');
				$('.task-edit .btn-success').on('click', function(e) {
					var shortName = 'Название задачи не может быть таким коротким!';
					var arrayOfProjectTask = [];
					$(".project[data-id="+ projectId +"] .task-text").each(function(i, e) {
						arrayOfProjectTask.push($(e).text());
					});
					var parentNode = e.target.parentElement.parentElement;
					var newText = $(parentNode).children('.form-control').val();
					
					if (text === newText) {
						resetTask();
					} else if (newText === '') {
						addError(shortName);
					} else if (newText.length < 4) {
						addError(shortName);
					} else if (arrayOfProjectTask.indexOf(newText) > -1) {
						addError('Задача с таким названием в текущем проекте уже существует!');
					}	

					if ($('.alert-danger:visible').length === 0) {
						$(textNode).text(newText).css('display', 'inline-block');
						$(str).children().children('.task-edit').css('display', 'none');
						// запись в БД изменения названия задачи
						var query = "action=editTask&projectId=" + projectId + "&taskName=" + newText + "&taskId=" + taskId;
						$.ajax({
							url: 'server.php',
							type: 'POST',
							data: query,
							success: function(data) {
								console.log(data);
							}
						});		
					}

				})
			}

			function resetTask () {
				$('.task-edit:visible').css('display', 'none');
				$('.task-text:hidden').css('display', 'inline-block');
			}

			function successProject() {
				$('.edit-project .btn-success').on('click', function(element) {
					$('.alert-danger').css('display', 'none');
					$('.error-text').remove();
					var text = $('.useful:visible input').val();
					var parentNode = $('.useful:visible').parent();
					validateNewProject(text);
					if ($('.alert-danger:visible').length === 0) {
						saveProjectName(parentNode, text);
						$('.add-list').css('display', 'block');
						$('.new-project input[type="text"]').val('');
						$('.new-project').css('display', 'none');
					}
				});
			}

			function successTask() {
				$('.new-task .btn-success').off('click');
				$('.new-task .btn-success').on('click', function(e) {
					resetTask();
					$('.alert-danger').css('display', 'none');
					$('.error-text').remove();
					var parentNode = e.target.parentElement.parentElement;
					var text = $(parentNode).children('input').val();
					var idProject = $(parentNode).attr('data-id');
					validateTask(text, parentNode, idProject);
					if ($('.alert-danger:visible').length === 0) {
						saveTaskName(parentNode, text);
					}
				});	
			}

			TodoList();
			successProject();
			successTask();

				function addError(errorText) {
					if ($('.error-text').length > 0) {
						$('.error-text').text(errorText);
					} else {
						$('.alert-danger').append('<span class="error-text">' + errorText + '</span>');
						$('.alert-danger').css('display', 'block');
					}
				}

				function validateNewProject(text, elem) {
					var arrayOfProjectName = [];
					var shortName = 'Название проекта не может быть таким коротким!';
					$('.project-name').each(function(i, e) {
						arrayOfProjectName.push($(e).text());
					});

					if (text === '') {
						addError(shortName);
					} else if (text.length < 4) {
						addError(shortName);
					} else if (arrayOfProjectName.indexOf(text) > -1) {
						addError('Проект с таким названием уже существует!');
					}
				}

				function validateTask(text, parentNode, idProject) {
					var shortName = 'Название задачи не может быть таким коротким!';
					var arrayOfProjectTask = [];
					$(".project[data-id="+ idProject +"] .task-text").each(function(i, e) {
						arrayOfProjectTask.push($(e).text());
					});

					if (text === '') {
						addError(shortName);
					} else if (text.length < 4) {
						addError(shortName);
					} else if (arrayOfProjectTask.indexOf(text) > -1) {
						addError('Задача с таким названием в текущем проекте уже существует!');
					}
				}

				function saveProjectName(parentNode, text) {
					if (!text) {
						if ($(parentNode).has('.project-name').length > 0) {
							$(parentNode).children('.project-name').css('display', 'inline-block');
						}
					} else {
						var idProject = ($(parentNode).children('.project-tools').attr('data-id'));
						var parentNodeClassName = $(parentNode).attr('class');
						if (parentNodeClassName.indexOf('new-project') === -1) {
							$(parentNode).children('.project-name').text(text);
							$(parentNode).children('.project-name').css('display', 'inline-block')
							$('.useful:visible').css('display', 'none');
							//тут должен быть запрос в БД для сохранения нового имени проекта
							var query = "action=editProject&projectId=" + idProject + "&projectName=" + text;
							$.ajax({
								url: 'server.php',
								type: 'POST',
								data: query,
								success: function(data) {
									console.log(data);
								}
							});	
						} else {
							var lastId = $('.project:last').attr('data-id');
							addNewProject(lastId, text);
						}

					}
				}

				function saveTaskName(parentNode, text) {
					var projectID = $(parentNode).attr('data-id');
					var newTaskId = ($(".project[data-id="+ projectID +"] tr").length) + 1;
					if (text) {
						addNewTask(newTaskId, text, projectID);		
					} 
				}

				function addNewProject(lastId, projectName) {
					var lastId = lastId || 0;
					var idProject = +lastId + 1;
					$('.project-list').append("<div class='project' data-id='" + idProject + "'><div class='container'><div class='navbar-header'><span class='glyphicon glyphicon-calendar'></span><span class='project-name'>"+ projectName + "</span><div class='useful input-group edit-project'><input type='text' class='form-control'><span class='input-group-btn'><button class='btn btn-danger' type='button'> <span class='glyphicon glyphicon-remove'></span></button><button class='btn btn-success'	type='button'><span class='glyphicon glyphicon-ok'></span></button></span></div><div class='tools-container project-tools'	data-id='"+ idProject +"'> <span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-trash'></span></div></div></div><div class='addTaskPanel'><span class='glyphicon glyphicon-plus'></span><div class='input-group new-task' data-id=" + idProject + "><input placeholder='Start typing here to create a task...' type='text' class='form-control'><span class='input-group-btn'><button class='btn btn-success' type='button'>Add task</button></span></div></div><div class='task-container'><div class='table-responsive'><table class='table table-bordered' data-id="+ idProject +"><tbody></tbody></table></div></div></div>");
					TodoList();
					successTask();
					// запрос в БД для записи нового проекта
					var query = "action=newProject&projectId=" + idProject + "&projectName=" + projectName;
					$.ajax({
						url: 'server.php',
						type: 'POST',
						data: query,
						success: function(data) {
							console.log(data);
						}
					});

				}

				function addNewTask(newTaskId, text, projectID) {
					$(".project[data-id="+ projectID +"] tbody").append("<tr data-id='"+ newTaskId +"'><td class='col-xs-1'><div class='checkbox'><label><input type='checkbox' value=''></label></div></td><td class='col-xs-9'><span class='task-text'>"+ text +"</span><div class='task-edit input-group'><input type='text' class='form-control'><span class='input-group-btn'><button class='btn btn-danger' type='button'><span class='glyphicon glyphicon-remove'></span></button><button class='btn btn-success' type='button'><span class='glyphicon glyphicon-ok'></span></button></span></div></td><td class='col-xs-2'><div class='tools-container'> <span class='glyphicon glyphicon-resize-vertical'></span> <span class='glyphicon glyphicon-pencil'></span> <span class='glyphicon glyphicon-trash'></span></div></td></tr>");
					TodoList();
					successEditTask();
					$(".project[data-id="+ projectID +"] .new-task input").val('');
					// запрос в БД для записи новой задачи
					var query = "action=newTask&projectId=" + projectID + "&taskId=" + newTaskId + "&taskName=" + text;
					$.ajax({
						url: 'server.php',
						type: 'POST',
						data: query,
						success: function(data) {
							console.log(data);
						}
					});
				}

		});
}());