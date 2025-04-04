Feature: Native operations for different transaction models

  Scenario Outline: Successful native <native_call> with <transaction_model> and <payment_amount> CSPR payment
    Given an origin account with 'almost_infinite' CSPR
    When the origin account sends a "<native_call>" "<transaction_model>" of <input_amount> CSPR
    And the transaction payment is <payment_amount> CSPR
    Then the transaction is executed successfully
    And the consumed amount is <consumed_amount> motes
    And the transaction cost is <cost> motes
    And the refund amount is <refund> motes
#
    Examples:
      | native_call | transaction_model | payment_amount | input_amount | consumed_amount | cost       | refund    |
      | Transfer    | TransactionV1     | 0.1            | 5            | 100000000       | 100000000  | 0         |
      | Transfer    | TransactionV1     | 3              | 5            | 3000000000      | 3000000000 | 0         |
      | Transfer    | Deploy            | 0.1            | 5            | 100000000       | 100000000  | 0         |
      | Transfer    | Deploy            | 3              | 5            | 100000000       | 100000000  | 0         |
      | Delegate    | TransactionV1     | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Undelegate  | TransactionV1     | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Redelegate  | TransactionV1     | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Delegate    | Deploy            | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Delegate    | Deploy            | 3              | 5            | 2500000000      | 3000000000 | 495000000 |
      | Undelegate  | Deploy            | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Undelegate  | Deploy            | 3              | 5            | 2500000000      | 3000000000 | 495000000 |
      | Redelegate  | Deploy            | 2.5            | 5            | 2500000000      | 2500000000 | 0         |
      | Redelegate  | Deploy            | 3              | 5            | 2500000000      | 3000000000 | 495000000 |

  Scenario Outline: Rejected transfer with <transaction_model> and <payment_amount> CSPR payment
    Given an origin account with 'almost_infinite' CSPR
    When the origin account sends a "<native_call>" "<transaction_model>" of <input_amount> CSPR
    And the transaction payment is <payment_amount> CSPR
    Then the transaction is rejected with error <expected_error>

    Examples:
      | native_call | transaction_model | payment_amount | input_amount | expected_error                               |
      | Transfer    | TransactionV1     | 0.05           | 5            | "Invalid payment amount for Transaction::V1" |
      | Delegate    | TransactionV1     | 0.05           | 5            | "Invalid payment amount for Transaction::V1" |
      | Undelegate  | TransactionV1     | 0.05           | 5            | "Invalid payment amount for Transaction::V1" |
      | Redelegate  | TransactionV1     | 0.05           | 5            | "Invalid payment amount for Transaction::V1" |
#      | Transfer    | Deploy            | 0.05           | 5            | "Invalid payment amount for Transaction::Deploy" |

  Scenario Outline: Rejected transfer with <transaction_model> and <payment_amount> CSPR payment for an account with insufficient balance
    Given an origin account with '1' CSPR
    When the origin account sends a "<native_call>" "<transaction_model>" of <input_amount> CSPR
    And the transaction payment is <payment_amount> CSPR
    Then the transaction is rejected with error <expected_error>

    Examples:
      | native_call | transaction_model | payment_amount | input_amount | expected_error                               |
      | Transfer    | TransactionV1     | 0.1            | 5            | "Transaction execution failed: the transaction was invalid: insufficient balance" |
      | Delegate    | TransactionV1     | 2.5            | 5            | "Transaction execution failed: the transaction was invalid: insufficient balance" |
      | Undelegate  | TransactionV1     | 2.5            | 5            | "Transaction execution failed: the transaction was invalid: insufficient balance" |
      | Redelegate  | TransactionV1     | 2.5            | 5            | "Transaction execution failed: the transaction was invalid: insufficient balance" |
