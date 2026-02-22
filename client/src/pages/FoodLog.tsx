import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext"
import type { FoodEntry, FormData } from "../types";
import Card from "../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import { Loader2Icon, PlusIcon, SparkleIcon, UtensilsCrossedIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import mockApi from "../assets/mockApi";


const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();

  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: 0,
    mealType: ''
  })

  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0];

  const loadEntries = () => {
    const todaysEntries = allFoodLogs.filter((e: FoodEntry) => e.createdAt?.split('T')[0] === today)
    setEntries(todaysEntries)
  }

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const {data} = await mockApi.foodLogs.create({data: formData})
    setAllFoodLogs(prev => [...prev, data])
    setFormData({name: '', calories: 0, mealType: ''})
    setShowForm(false)
  }

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  // Group entries by meal
  const groupedEntries: Record<'breakfast' | 'lunch'| 'dinner' | 'snack',
  FoodEntry[]> = entries.reduce((acc, entry)=>{
    if(!acc[entry.mealType]) acc[entry.mealType] = [];
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<'breakfast' | 'lunch'| 'dinner' | 'snack', FoodEntry[]>)

  const handleQuickAdd = (activityName: string) => {
    setFormData({ ...formData, mealType: activityName })
    setShowForm(true)
  }

  useEffect(() => {
    (() => {
      loadEntries();
    })();
  }, [allFoodLogs])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Food Log</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your daily intake</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today's Total</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalCalories} kcal</p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick Add Section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Quick Add</h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map((activity) => (
                  <button onClick={() => handleQuickAdd(activity.name)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200
              dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                    key={activity.name}>
                    {activity.emoji} {activity.name}
                  </button>
                ))}
              </div>
            </Card>

            <div className="space-y-4 w-full">

              {/* Add Food Entry */}
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2
               bg-emerald-500 hover:bg-emerald-600
               text-white font-medium
               py-4 rounded-xl
               transition-all duration-200 cursor-pointer"
              >
                <PlusIcon className="size-5" />
                Add Food Entry
              </button>

              {/* AI Food Snap */}
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2
               bg-emerald-500 hover:bg-emerald-600
               text-white font-medium
               py-4 rounded-xl
               transition-all duration-200 cursor-pointer"
              >
                <SparkleIcon className="size-5" />
                AI Food Snap
              </button>

              <input
                type="file"
                accept="image/*"
                hidden
                ref={inputRef}
              />

              {loading && (
                <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100">
                  <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Add Form */}
       
        {showForm && (
          <Card className="border-2 border-emerald-200 dark:border-r-emerald-800">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">New Food Entry</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })}
                placeholder="e.g., Grilled Chicken Salad" required />

              <Input label="Calories" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })}
                placeholder="e.g., 350" required min={1} />

              <Select className="mt-2" label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: v.toString() })}
                options={mealTypeOptions} placeholder="Select meal type" required />

              <div className="flex gap-3 pt-2">

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: "",
                      calories: 0,
                      mealType: "",
                    });
                  }}
                  className="flex-1 py-3 rounded-xl
                bg-slate-600 dark:bg-slate-800 hover:bg-slate-700
               text-white font-medium
               transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>

                {/* Add Entry Button */}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl
               bg-emerald-500 hover:bg-emerald-600
               text-white font-medium
               shadow-md active:scale-[0.98]
               transition-all duration-200 cursor-pointer"
                >
                  Add Entry
                </button>

              </div>
            </form>



          </Card>
        )}

        {/* Entries List */}
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500" />
            </div>

            <h3 className="font-semibold text-slate-700  dark:text-slate-200 mb-2">No food logged today</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Start tracking your meals to stay on target</p>
          </Card>
        ) : (

          <div className="space-y-4">
           {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType)=>{
            const mealTypeKey = mealType as keyof typeof groupedEntries;
            if(!groupedEntries[mealTypeKey]) return null;

            const MealIcon = mealIcons[mealTypeKey];
            const mealCalories = groupedEntries[mealTypeKey].reduce((sum, e)=> sum + e.calories, 0);
            
            return(
              <Card key={mealType}>
                <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
                    <MealIcon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white capitalize">{mealType}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{groupedEntries[mealTypeKey].length} items</p>
                  </div>
                 </div>
                </div>
              </Card>
            )
           })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodLog
