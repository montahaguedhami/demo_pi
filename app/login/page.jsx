"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Lock, Mail, Eye, EyeOff, ArrowRight, User, Shield, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, getRoleLabel, getRoleDescription } from "@/lib/auth-context"


const demoAccounts = [
  { role, email, password, icon },
  { role, email, password, icon },
  { role, email, password, icon },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Login failed")
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")
    setIsLoading(true)

    const result = await login(demoEmail, demoPassword)
    
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Login failed")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SkillMatch</h1>
              <p className="text-sm text-primary-foreground/70">HR Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-balance">
              AI-Powered Skills Management for Modern Teams
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-md">
              Automate employee selection, track skill development, and make data-driven HR decisions with intelligent recommendations.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-4">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-primary-foreground/70">Skills Tracked</div>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 backdrop-blur-sm p-4">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-primary-foreground/70">Match Accuracy</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            Trusted by leading enterprises worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SkillMatch</h1>
              <p className="text-xs text-muted-foreground">HR Platform</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
            </div>
          </div>

          <div className="space-y-3">
            {demoAccounts.map((account) => {
              const Icon = account.icon
              return (
                <Card
                  key={account.role}
                  className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm">{getRoleLabel(account.role)}</CardTitle>
                        <CardDescription className="text-xs">{getRoleDescription(account.role)}</CardDescription>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}



