import React from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";
import Button from "../UI/Button";
import Input from "./Input";

const ExpenseForm = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
}) => {
  const [inputs, setInputs] = React.useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true,
    },
  });

  const submitHandler = () => {
    const expenseData = {
      amount: +inputs.amount.value, // Transform string to number
      description: inputs.description.value,
      date: new Date(inputs.date.value),
    };
    const isValid = validateExpense(expenseData);
    if (isValid) {
      onSubmit(expenseData);
      cleanState();
    }
  };

  const formIsInvalid = Object.values(inputs).some((input) => !input.isValid);

  const validateExpense = (expenseData) => {
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid =
      (expenseData.date instanceof Date ||
        expenseData.date.toString() !== "Invalid Date") &&
      !isNaN(expenseData.date);
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (descriptionIsValid && amountIsValid && dateIsValid) {
      return true;
    } else {
      setInputs((prevInputs) => {
        return {
          amount: {
            value: prevInputs.amount.value,
            isValid: amountIsValid,
          },
          description: {
            value: prevInputs.description.value,
            isValid: descriptionIsValid,
          },
          date: {
            value: prevInputs.date.value,
            isValid: dateIsValid,
          },
        };
      });

      return false;
    }
  };

  const cleanState = () => {
    setInputs({
      description: "",
      amount: "",
      date: "",
    });
  };

  const inputChangeHandler = (inputIdentifier, value) => {
    setInputs({
      ...inputs,
      [inputIdentifier]: { value, isValid: true },
    });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          label={"Amount"}
          style={styles.rowInput}
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            value: inputs.amount.value,
            KeyboardType: "decimal-pad",
            placeholder: "0.00",
            onChangeText: (text) => inputChangeHandler("amount", text),
          }}
        />
        <Input
          label={"Date"}
          style={styles.rowInput}
          invalid={!inputs.date.isValid}
          textInputConfig={{
            value: inputs.date.value,
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: (date) => inputChangeHandler("date", date),
          }}
        />
      </View>

      <Input
        label={"Description"}
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCaptalize: "none",
          // autoCorrect: false,
          // autoCompleteType: "off",
          // spellCheck: false,
          // autoComplete: "off",
          placeholder: "Enter a description",
          maxLength: 10,
          value: inputs.description.value,
          onChangeText: (description) =>
            inputChangeHandler("description", description),
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - Please check your entered data
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
    textAlign: "center",
    margin: 8,
  },
  form: {
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});

export default ExpenseForm;
