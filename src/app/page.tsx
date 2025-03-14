import DataTable from './components/DataTable'
import WizardForm from './components/WizardForm'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 space-y-24 max-w-7xl mx-auto">
      <div className="w-full max-w-3xl">
        <WizardForm />
      </div>
      <div className="w-full max-w-5xl">
        <div className="divider"></div>
      </div>
      <div className="w-full glass-card p-6">
        <DataTable />
      </div>
    </div>
  )
}
