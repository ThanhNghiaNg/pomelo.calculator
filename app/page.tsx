"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CalculationResult {
  id: string
  side1: number
  side2: number
  layers: number
  add: number
  subtract: number
  totalFruits: number
  totalBoxes: number
  moduloBoxes: number
  timestamp: number
}

export default function CalculatorPage() {
  const [side1, setSide1] = useState("")
  const [side2, setSide2] = useState("")
  const [layers, setLayers] = useState("")
  const [add, setAdd] = useState("")
  const [subtract, setSubtract] = useState("")
  const [result, setResult] = useState<{ totalFruits: number; totalBoxes: number, moduloBoxes: number } | null>(null)
  const [history, setHistory] = useState<CalculationResult[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("calculationHistory")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const handleCalculate = () => {
    const num1 = Number.parseFloat(side1)
    const num2 = Number.parseFloat(side2)
    const numLayers = Number.parseFloat(layers)
    const numAdd = Number.parseFloat(add) || 0
    const numSubtract = Number.parseFloat(subtract) || 0

    if (!isNaN(num1) && !isNaN(num2) && !isNaN(numLayers)) {
      let totalFruits = numAdd - numSubtract;
      for (let i =0; i<numLayers; i++){
        totalFruits += (num1 + i) * (num2 + i);
      }
      const totalBoxes = Math.floor(totalFruits / 12)
      const moduloBoxes = totalFruits % 12 || 0

      setResult({ totalFruits, totalBoxes, moduloBoxes })

      const newCalculation: CalculationResult = {
        id: Date.now().toString(),
        side1: num1,
        side2: num2,
        layers: numLayers,
        add: numAdd,
        subtract: numSubtract,
        totalFruits,
        totalBoxes,
        moduloBoxes,
        timestamp: Date.now(),
      }

      const newHistory = [newCalculation, ...history]
      setHistory(newHistory)
      localStorage.setItem("calculationHistory", JSON.stringify(newHistory))
    }
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem("calculationHistory")
  }

  const handleDeleteItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("calculationHistory", JSON.stringify(newHistory))
  }

  const handleReset = () => {
    setSide1("")
    setSide2("")
    setLayers("")
    setAdd("")
    setSubtract("")
    setResult(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr,400px] gap-6">
        <Card className="w-full border-2 border-primary rounded-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-primary">Máy tính bưởi</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Nhập các thông số để tính toán số lượng bưởi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="side1" className="text-sm font-medium text-foreground">
                  Cạnh trên 1
                </Label>
                <Input
                  id="side1"
                  type="number"
                  placeholder="Nhập giá trị"
                  value={side1}
                  onChange={(e) => setSide1(e.target.value)}
                  className="border-2 border-border rounded-lg h-11 text-base bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="side2" className="text-sm font-medium text-foreground">
                  Cạnh trên 2
                </Label>
                <Input
                  id="side2"
                  type="number"
                  placeholder="Nhập giá trị"
                  value={side2}
                  onChange={(e) => setSide2(e.target.value)}
                  className="border-2 border-border rounded-lg h-11 text-base bg-input"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="layers" className="text-sm font-medium text-foreground">
                  Số lớp
                </Label>
                <Input
                  id="layers"
                  type="number"
                  placeholder="Nhập giá trị"
                  value={layers}
                  onChange={(e) => setLayers(e.target.value)}
                  className="border-2 border-border rounded-lg h-11 text-base bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add" className="text-sm font-medium text-foreground">
                  Thêm
                </Label>
                <Input
                  id="add"
                  type="number"
                  placeholder="Số lượng thêm (tùy chọn)"
                  value={add}
                  onChange={(e) => setAdd(e.target.value)}
                  className="border-2 border-border rounded-lg h-11 text-base bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtract" className="text-sm font-medium text-foreground">
                  Bớt
                </Label>
                <Input
                  id="subtract"
                  type="number"
                  placeholder="Số lượng bớt (tùy chọn)"
                  value={subtract}
                  onChange={(e) => setSubtract(e.target.value)}
                  className="border-2 border-border rounded-lg h-11 text-base bg-input"
                />
              </div>
            </div>

            {result !== null && (
              <div className="border-2 border-primary rounded-xl bg-card p-6 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Kết quả</p>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-foreground">
                    Theo trái: <span className="text-primary">{Math.round(result.totalFruits)} trái</span>
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    Theo chục: <span className="text-secondary">{result.totalBoxes} chục {result.moduloBoxes ? `, ${result.moduloBoxes} trái` : ""}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                className="flex-1 h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Tính toán
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 h-11 text-base font-semibold border-2 border-primary hover:bg-accent rounded-lg bg-transparent"
              >
                Đặt lại
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-2 border-border rounded-xl lg:max-h-[600px] flex flex-col">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">Lịch sử</CardTitle>
              {history.length > 0 && (
                <Button
                  onClick={handleClearHistory}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground">Các phép tính trước đó</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có lịch sử tính toán</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="border-2 border-border rounded-lg p-4 space-y-2 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs text-muted-foreground flex-1">
                      {new Date(item.timestamp).toLocaleString("vi-VN")}
                    </div>
                    <Button
                      onClick={() => handleDeleteItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      Cạnh: {item.side1} + {item.side2}, Lớp: {item.layers}
                    </p>
                    {(item.add > 0 || item.subtract > 0) && (
                      <p className="text-muted-foreground text-xs">
                        {item.add > 0 && `Thêm: ${item.add}`}
                        {item.add > 0 && item.subtract > 0 && ", "}
                        {item.subtract > 0 && `Bớt: ${item.subtract}`}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-border space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Theo trái: <span className="text-primary">{Math.round(item.totalFruits)} trái</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Theo chục: <span className="text-secondary">{item.totalBoxes} chục {item.moduloBoxes ? `, ${item.moduloBoxes} trái` : ""}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
