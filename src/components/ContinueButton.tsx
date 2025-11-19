import { Button, ModalFooter, useStyleConfig, Box } from "@chakra-ui/react"
import { themeOverrides } from "../theme"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from "@chakra-ui/react"

type ContinueButtonProps = {
  onContinue: (val: any) => void
  onBack?: () => void
  title: string
  backTitle?: string
  isLoading?: boolean
}

export const ContinueButton = ({ onContinue, onBack, title, backTitle, isLoading }: ContinueButtonProps) => {
  const styles = useStyleConfig("Modal") as (typeof themeOverrides)["components"]["Modal"]["baseStyle"]
  const nextButtonMobileWidth = onBack ? "8rem" : "100%"
  return (
    <ModalFooter>
      {onBack && (
        <Popover>
                      <PopoverTrigger>
                        <Box bg="blue.300" p={2}>Hover me</Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <Button size="md" sx={styles.backButton} onClick={onBack} isLoading={isLoading} variant="link">
          {backTitle}
        </Button>
                      </PopoverContent>
                    </Popover>
        
      )}
      <Button
        size="lg"
        w={{ base: nextButtonMobileWidth, md: "21rem" }}
        sx={styles.continueButton}
        onClick={onContinue}
        isLoading={isLoading}
      >
        {title}
      </Button>
    </ModalFooter>
  )
}
