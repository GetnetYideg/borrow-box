import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isRegistering } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setApiError(null);
      await registerUser(values);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please ensure the email is @company.com and not already in use.';
      setApiError(message);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader
        title="Create an account"
        subtitle="Sign up with your organization email to start tracking items"
      />
      <CardContent>
        {apiError && <ErrorMessage message={apiError} className="mb-4" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Sarah Jenkins"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Corporate Email"
            type="email"
            placeholder="sarah@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            helperText="Must be a valid internal @company.com address"
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isRegistering}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="w-full mt-2 font-semibold"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 pt-4 text-center border-t border-moss/10 dark:border-forest-700 text-xs text-forest/70 dark:text-cream/70">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-moss dark:text-gold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
