import mongoose from 'mongoose';

// Connect to MongoDB
const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  description: { type: String },
  status: { type: String, enum: ['Not Started', 'In-Progress', 'Completed'], default: 'Not Started' },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export async function GET() {
  try {
    await connectDb();
    const tasks = await Task.find();
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error fetching tasks' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const { title, dueDate, description } = await req.json();
    const task = new Task({ title, dueDate, description });
    await task.save();
    return new Response(JSON.stringify(task), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error creating task' }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { title, dueDate, description, status } = await req.json();
    const task = await Task.findByIdAndUpdate(
      params.id,
      { title, dueDate, description, status },
      { new: true }
    );
    return new Response(JSON.stringify(task), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error updating task' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    await Task.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: 'Task deleted' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error deleting task' }), { status: 500 });
  }
}
