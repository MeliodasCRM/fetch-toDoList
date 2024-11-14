import React, { useEffect, useState } from "react";

const Home = () => {
	const [task, setTask] = useState([]);
	const [newTask, setNewTask] = useState("");
	const apiUrl = "https://playground.4geeks.com/todo"

	const handleChange = (event) => {
		setNewTask(event.target.value);
	}

	// Comprobar existencia del usuario en postman
	fetch(`${apiUrl}/users/Meliodas`)
		.then(response => {
			if (response.status === 404) {
				return fetch(`${apiUrl}/users/Meliodas`, {
					method: 'POST'
				})
			} else return response.json()
		})
		.then(data => { console.log("Todo bien con el usuario", data) })
		.catch(error => console.log("Todo mal con el usuario jaja", error))

	// Traer mi lista de tareas
	useEffect(() => {
		fetch(`${apiUrl}/users/Meliodas`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Error al obtener las tareas');
				}
				return response.json();
			})
			.then(data => {
				setTask(data.todos.map(({ label, is_done, id }) => ({ label, is_done, id })));
			})
			.catch(error => {
				console.log(error);
				setTask([]);
			});
	}, []);

	// Crear tareas
	const addTask = () => {
		if (newTask) {
			fetch(`${apiUrl}/todos/Meliodas/`, {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ label: newTask, is_done: false }),
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					setTask((prevTasks) => [...prevTasks, {
						label: data.label,
						is_done: data.is_done,
						id: data.id
					}]);
					setNewTask("")
				})
				.catch(error => {
					console.log(error)
				})
		}
	}

	// Función para eliminar las tasks
	const deleteTask = (id) => {
		fetch(`${apiUrl}/todos/${id}`, {
			method: "DELETE"
		})
			.then(response => {
				if (response.ok) {
					setTask((prevTasks) => prevTasks.filter(task => task.id !== id));
				} else {
					console.log("Fallo al eliminar la task");
				}
			})
			.catch(error => console.log(error));
	};

	return (
		<div className="todo-list">
			<h1>To Do List</h1>
			<div className="input-container">
				<input
					type="text"
					placeholder="Add a new task"
					value={newTask}
					onChange={handleChange}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							addTask();
						}
					}}
				/>
			</div>

			<ul className="tasksToDo">
				{Array.isArray(task) && task.length > 0 ? (
					task.map((elemento) => (
						<li key={elemento.id} className="task-item">
							{elemento.label}
							<button className="delete-button" onClick={() => deleteTask(elemento.id)}>
								Eliminar
							</button>
						</li>
					))
				) : (
					<li>No hay tareas para mostrar</li>
				)}
			</ul>
		</div>
	);
};

export default Home;
