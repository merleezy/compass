import ProgressCard from "../components/ui/ProgressCard"

export default function TasksPage() {
  return (
    <div>
      {/* Page Heading */}
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold text-text tracking-tight mb-2">
          Tasks
        </h2>
        <p className="text-text-muted font-body italic">
          Organize your day, master your time.
        </p>
      </div>

      {/* Two column grid */}
      <div className='grid grid-cols-12 gap-8'>
        {/* Left column */}
        <div className='col-span-8 space-y-8'>
          <ProgressCard completed="1" total="3" title="Daily Tasks Progress"/>
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-8">
          
        </div>

      </div>
    </div>
  )
}