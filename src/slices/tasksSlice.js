import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  tasksList: [],
  selectedTask: {},
  isLoading: false, // API call success or failure
  error: "", // Error Handline
};

const BASE_URL = "http://localhost:8000/tasks";

//GET
export const getTasksFromServer = createAsyncThunk(
  "tasks/getTasksFromServer",
  async (_, { rejectWithValue }) => {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      return rejectWithValue({ error: "No Tasks Found" });
    }
  }
);

//POST

export const addTaskToServer = createAsyncThunk(
  "tasks/addTaskToServer",
  async (task, { rejectWithValue }) => {
    const options = {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const response = await fetch(BASE_URL, options);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      return rejectWithValue({ error: "Task Not Added" });
    }
  }
);

const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState,
  reducers: {
    addTaskToList: (state, action) => {
      const id = Math.random() * 100;
      let task = { ...action.payload, id };
      state.tasksList.push(task);
    },
    removeTaskFromList: (state, action) => {
      state.tasksList = state.tasksList.filter(
        (task) => task.id !== action.payload.id
      );
    },
    updateTaskInList: (state, action) => {
      state.tasksList = state.tasksList.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET cases of Thunk lifecycle
      .addCase(getTasksFromServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasksFromServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.tasksList = action.payload;
      })
      .addCase(getTasksFromServer.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload.error;
        state.tasksList = [];
      })
      // POST cases of Thunk lifecycle
      .addCase(addTaskToServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTaskToServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.tasksList.push(action.payload);
      })
      .addCase(addTaskToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export const {
  addTaskToList,
  removeTaskFromList,
  updateTaskInList,
  setSelectedTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
