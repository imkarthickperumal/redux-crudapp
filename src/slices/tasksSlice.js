import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasksList: [],
  selectedTask: {},
};

const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState: initialState,
});
