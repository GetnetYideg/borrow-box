import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, CheckCircle } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const registered = searchParams.get('registered') === 'true';
  const { login, isLoggingIn } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setApiError(null);
      await login(values);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid credentials. Please verify your email and password.';
      setApiError(message);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader
        title="Sign in to your account"
        subtitle="Enter your corporate credentials to access BorrowBox"
      />
      <CardContent>
        {registered && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Account created successfully! Please sign in.</span>
          </div>
        )}

        {apiError && <ErrorMessage message={apiError} className="mb-4" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@gmail.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            helperText="Must be a valid @gmail.com email address"
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoggingIn}
            leftIcon={<LogIn className="w-4 h-4" />}
            className="w-full mt-2 font-semibold"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-4 text-center border-t border-moss/10 dark:border-forest-700 text-xs text-forest/70 dark:text-cream/70">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-moss dark:text-gold hover:underline"
          >
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
