import mongoose, { Schema, Types } from "mongoose";

// The compile-time shape of a HabitLog. We hand-write this so the compiler
// (and your editor's autocomplete) knows exactly what fields a log has.
//
// Note `Types.ObjectId` here vs `Schema.Types.ObjectId` in the schema below:
//   - Schema.Types.ObjectId is the *schema config* — it tells Mongoose how to
//     validate/store the field at runtime.
//   - Types.ObjectId is the *value type* — it's what the field actually IS on a
//     real document you've fetched. The interface describes values, so it uses
//     this one.
//
// createdAt/updatedAt are included because `timestamps: true` adds them.
interface IHabitLog {
  habitId: Types.ObjectId;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Passing <IHabitLog> ties the runtime schema to the compile-time type. If the
// two ever drift apart (e.g. you typo a field or give it the wrong type),
// `npm run typecheck` will flag it.
const habitLogSchema = new Schema<IHabitLog>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    // Using a string instead of a date object keeps "which day" unambiguous
    // regardless of timezones, which is important for a daily tracker
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index: One log per habit per day. This prevents accidentally
// marking the same habit complete twice on the same day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// `export =` is TypeScript's CommonJS export — it compiles to
// `module.exports = ...`, so the .js files that still `require('./HabitLog')`
// get the model directly (no `.default` unwrapping needed) during the
// migration. Once everything is TS, we can switch to `export default`.
export = mongoose.model<IHabitLog>("HabitLog", habitLogSchema);
